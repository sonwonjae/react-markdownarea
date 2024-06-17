import type { KeyboardEvent as ReactKeyboardEvent } from 'react';

import {
	ChangeSelectionRange,
	GapType,
	ReplaceSelectionMarkdown,
} from '@/components/Markdownarea/contexts/keymap/types';
import { ChangeValue } from '@/components/Markdownarea/contexts/value/types';
import { StyledTextType } from '@/constants';
import {
	parseMarkdownListToValue,
	parseValueToMarkdownList,
	reorderOli,
} from '@/utils/markdown';
import { getMarkdownSelectionStartWithMarkdownList } from '@/utils/markdown/selection';
import { toggleStyledText } from '@/utils/markdown/styledText';

import { RecordHistory } from '../../history/types';
import { MarkdownareaPropsContextValue } from '../../props/types';

const getMarkdownIndexMap = (e: ReactKeyboardEvent<HTMLTextAreaElement>) => {
	/** NOTE: get markdown selectRange index */
	const startIndexMap = getMarkdownSelectionStartWithMarkdownList({
		value: e.currentTarget.value,
		selectionIndex: e.currentTarget.selectionStart,
	});

	const endIndexMap = getMarkdownSelectionStartWithMarkdownList({
		value: e.currentTarget.value,
		selectionIndex: e.currentTarget.selectionEnd,
	});

	const finalDirect = (() => {
		switch (true) {
			case e.currentTarget.selectionStart < e.currentTarget.selectionEnd:
				return 'forward';
			case e.currentTarget.selectionStart > e.currentTarget.selectionEnd:
				return 'backward';
			default:
				return 'none';
		}
	})();

	return {
		startIndexMap: finalDirect === 'forward' ? startIndexMap : endIndexMap,
		endIndexMap: finalDirect === 'forward' ? endIndexMap : startIndexMap,
	};
};

const getSelectionType = ({
	selectionStart,
	selectionEnd,
	startIndexMap,
	endIndexMap,
	index,
}: {
	selectionStart: number;
	selectionEnd: number;
	startIndexMap: ReturnType<typeof getMarkdownIndexMap>['startIndexMap'];
	endIndexMap: ReturnType<typeof getMarkdownIndexMap>['endIndexMap'];
	index: number;
}) => {
	switch (true) {
		/** NOTE: 시작점과 끝점이 같은 경우 */
		case selectionStart === selectionEnd:
			return 'same-selection';
		/** NOTE: 시작 라인과 끝 라인이 같은 경우 */
		case startIndexMap.indexInMarkdownList ===
			endIndexMap.indexInMarkdownList:
			return 'same-line';
		/** NOTE: 선택된 라인이 최소 두줄 이상이며 첫번째로 선택된 라인인 경우  */
		case index === startIndexMap.indexInMarkdownList:
			return 'first-line';
		/** NOTE: 선택된 라인이 최소 두줄 이상이며 마지막으로 선택된 라인인 경우  */
		case index === endIndexMap.indexInMarkdownList:
			return 'last-line';
		/** NOTE: 선택된 라인이 최소 두줄 이상이며 첫번째와 마지막을 제외한 라인인 경우 */
		default:
			return 'selection-line';
	}
};

const parseMarkdownWithSelection = ({
	type,
	markdown,
	startIndexMap,
	endIndexMap,
}: {
	type: ReturnType<typeof getSelectionType>;
	markdown: string;
	startIndexMap: ReturnType<typeof getMarkdownIndexMap>['startIndexMap'];
	endIndexMap: ReturnType<typeof getMarkdownIndexMap>['endIndexMap'];
}) => {
	switch (true) {
		/** NOTE: 시작점과 끝점이 같은 경우 */
		case type === 'same-selection':
			return {
				prevSelectionMarkdown: markdown.slice(
					0,
					startIndexMap.indexInMarkdown,
				),
				selectionMarkdown: markdown.slice(
					startIndexMap.indexInMarkdown,
					endIndexMap.indexInMarkdown,
				),
				nextSelectionMarkdown: markdown.slice(
					endIndexMap.indexInMarkdown,
				),
			} as const;
		/** NOTE: 시작 라인과 끝 라인이 같은 경우 */
		case type === 'same-line':
			return {
				prevSelectionMarkdown: markdown.slice(
					0,
					startIndexMap.indexInMarkdown,
				),
				selectionMarkdown: markdown.slice(
					startIndexMap.indexInMarkdown,
					endIndexMap.indexInMarkdown,
				),
				nextSelectionMarkdown: markdown.slice(
					endIndexMap.indexInMarkdown,
				),
			} as const;
		/** NOTE: 선택된 라인이 최소 두줄 이상이며 첫번째로 선택된 라인인 경우  */
		case type === 'first-line':
			return {
				prevSelectionMarkdown: markdown.slice(
					0,
					startIndexMap.indexInMarkdown,
				),
				selectionMarkdown: markdown.slice(
					startIndexMap.indexInMarkdown,
				),
				nextSelectionMarkdown: '',
			} as const;
		/** NOTE: 선택된 라인이 최소 두줄 이상이며 마지막으로 선택된 라인인 경우  */
		case type === 'last-line':
			return {
				prevSelectionMarkdown: '',
				selectionMarkdown: markdown.slice(
					0,
					endIndexMap.indexInMarkdown,
				),
				nextSelectionMarkdown: markdown.slice(
					endIndexMap.indexInMarkdown,
				),
			} as const;
		/** NOTE: 선택된 라인이 최소 두줄 이상이며 첫번째와 마지막을 제외한 라인인 경우 */
		default:
			return {
				prevSelectionMarkdown: '',
				selectionMarkdown: markdown,
				nextSelectionMarkdown: '',
			} as const;
	}
};

const calculateSelection = ({
	type,
	newMarkdown,
	nextSelectionStart,
	nextSelectionEnd,
	markdown,
	nextSelectionSameGapType,
	nextSelectionStartGapType,
	nextSelectionEndGapType,
}: {
	type: ReturnType<typeof getSelectionType>;
	newMarkdown: string | null;
	nextSelectionStart: number;
	nextSelectionEnd: number;
	markdown: string;
	nextSelectionSameGapType: GapType;
	nextSelectionStartGapType: GapType;
	nextSelectionEndGapType: GapType;
}) => {
	if (newMarkdown === null) {
		return {
			nextSelectionStart: nextSelectionStart,
			nextSelectionEnd: nextSelectionEnd - markdown.length - 1,
		};
	}

	const gap = newMarkdown.length - markdown.length;

	if (type === 'same-selection' || type === 'same-line') {
		if (nextSelectionSameGapType === 'include') {
			return {
				nextSelectionStart: nextSelectionStart,
				nextSelectionEnd: nextSelectionEnd + gap,
			};
		}
		if (nextSelectionSameGapType === 'exclude') {
			return {
				nextSelectionStart: nextSelectionStart + gap,
				nextSelectionEnd: nextSelectionEnd + gap,
			};
		}
		if (nextSelectionSameGapType === 'exclude-half') {
			return {
				nextSelectionStart: nextSelectionStart + Math.round(gap / 2),
				nextSelectionEnd: nextSelectionEnd + Math.round(gap / 2),
			};
		}
	}
	if (type === 'first-line') {
		if (nextSelectionStartGapType === 'include') {
			return {
				nextSelectionStart: nextSelectionStart,
				nextSelectionEnd: nextSelectionEnd + gap,
			};
		}
		if (nextSelectionStartGapType === 'exclude') {
			return {
				nextSelectionStart: nextSelectionStart + gap,
				nextSelectionEnd: nextSelectionEnd + gap,
			};
		}
	}
	if (type === 'last-line') {
		if (nextSelectionEndGapType === 'include') {
			return {
				nextSelectionStart: nextSelectionStart,
				nextSelectionEnd: nextSelectionEnd + gap,
			};
		}
		if (nextSelectionEndGapType === 'exclude') {
			return {
				nextSelectionStart: nextSelectionStart,
				nextSelectionEnd: nextSelectionEnd,
			};
		}
	}
	if (type === 'selection-line') {
		return {
			nextSelectionStart: nextSelectionStart,
			nextSelectionEnd: nextSelectionEnd + gap,
		};
	}
	throw new Error('여기까지 올 일이 없습니다.');
};

const judgeSelection = ({
	moveTo,
	nextSelectionStart,
	nextSelectionEnd,
}: {
	moveTo: Parameters<ChangeSelectionRange>[0]['moveTo'];
	nextSelectionStart: number;
	nextSelectionEnd: number;
}) => {
	const finalNextSelectionStart = (() => {
		switch (moveTo) {
			case 'first':
				return nextSelectionStart;
			case 'last':
				return nextSelectionEnd;
			default:
				return nextSelectionStart;
		}
	})();
	const finalNextSelectionEnd = (() => {
		switch (moveTo) {
			case 'first':
				return nextSelectionStart;
			case 'last':
				return nextSelectionEnd;
			default:
				return nextSelectionEnd;
		}
	})();

	return {
		nextSelectionStart: finalNextSelectionStart,
		nextSelectionEnd: finalNextSelectionEnd,
	};
};

const judgeFinalChangeValueParam = ({
	moveTo,
	changeValueParam,
}: {
	moveTo: Parameters<ChangeSelectionRange>[0]['moveTo'];
	changeValueParam: {
		markdownList: (string | null)[];
		nextSelectionStart: number;
		nextSelectionEnd: number;
	};
}) => {
	const newValue = parseMarkdownListToValue(
		changeValueParam.markdownList.filter((markdown) => {
			return typeof markdown === 'string';
		}) as Array<string>,
	);

	const { nextSelectionStart, nextSelectionEnd } = judgeSelection({
		moveTo,
		nextSelectionStart: changeValueParam.nextSelectionStart,
		nextSelectionEnd: changeValueParam.nextSelectionEnd,
	});

	return {
		newValue,
		nextSelectionStart,
		nextSelectionEnd,
	};
};

export const makeChangeValueParam = ({
	e,
	value,
	moveTo,
	nextSelectionSameGapType,
	nextSelectionStartGapType,
	nextSelectionEndGapType,
	replaceSelectionMarkdown,
}: {
	e: ReactKeyboardEvent<HTMLTextAreaElement>;
	value: string;
	moveTo: Parameters<ChangeSelectionRange>[0]['moveTo'];
	nextSelectionSameGapType: GapType;
	nextSelectionStartGapType: GapType;
	nextSelectionEndGapType: GapType;
	replaceSelectionMarkdown: ReplaceSelectionMarkdown;
}) => {
	const { startIndexMap, endIndexMap } = getMarkdownIndexMap(e);
	const markdownList = parseValueToMarkdownList(value);

	const changeValueParam = markdownList.reduce(
		(acc, markdown, index) => {
			/** NOTE: 선택되지 않은 범위 */
			if (
				index < startIndexMap.indexInMarkdownList ||
				index > endIndexMap.indexInMarkdownList
			) {
				return {
					markdownList: [...acc.markdownList, markdown],
					nextSelectionStart: acc.nextSelectionStart,
					nextSelectionEnd: acc.nextSelectionEnd,
				};
			}

			const type = getSelectionType({
				selectionStart: e.currentTarget.selectionStart,
				selectionEnd: e.currentTarget.selectionEnd,
				startIndexMap,
				endIndexMap,
				index,
			});
			const {
				prevSelectionMarkdown,
				selectionMarkdown,
				nextSelectionMarkdown,
			} = parseMarkdownWithSelection({
				type,
				markdown,
				startIndexMap,
				endIndexMap,
			});

			const newMarkdown = replaceSelectionMarkdown({
				type,
				prevSelectionMarkdown,
				selectionMarkdown,
				nextSelectionMarkdown,
			});

			const { nextSelectionStart, nextSelectionEnd } = calculateSelection(
				{
					type,
					newMarkdown,
					nextSelectionStart: acc.nextSelectionStart,
					nextSelectionEnd: acc.nextSelectionEnd,
					markdown,
					nextSelectionSameGapType,
					nextSelectionStartGapType,
					nextSelectionEndGapType,
				},
			);

			return {
				markdownList: [...acc.markdownList, newMarkdown],
				nextSelectionStart,
				nextSelectionEnd,
			};
		},
		{
			markdownList: [] as Array<string | null>,
			nextSelectionStart: e.currentTarget.selectionStart,
			nextSelectionEnd: e.currentTarget.selectionEnd,
		},
	);

	const finalChangeValueParam = judgeFinalChangeValueParam({
		moveTo,
		changeValueParam,
	});

	return finalChangeValueParam;
};

export const makeChangeValueUtil = ({
	e,
	onKeyDownInherit,
	recordHistory,
	value,
}: {
	e: ReactKeyboardEvent<HTMLTextAreaElement>;
	onKeyDownInherit: MarkdownareaPropsContextValue['onKeyDownInherit'];
	recordHistory: RecordHistory;
	value: string;
}) => {
	const changeValue: ChangeValue = ({
		newValue = e.currentTarget.value,
		nextSelectionStart = e.currentTarget.selectionStart,
		nextSelectionEnd,
	} = {}) => {
		e.preventDefault();
		if (e.nativeEvent.isComposing) {
			return;
		}

		const { reorderdValue, nextSelectionStart: finalSelectionStart } =
			reorderOli({
				value: newValue,
				selectionStart: nextSelectionStart,
			});

		e.currentTarget.value = reorderdValue;
		e.currentTarget.setSelectionRange(
			finalSelectionStart,
			nextSelectionEnd ?? finalSelectionStart,
		);
		onKeyDownInherit?.(e);

		recordHistory({
			value: reorderdValue,
			selectionStart: finalSelectionStart,
			selectionEnd: nextSelectionEnd ?? finalSelectionStart,
		});
	};

	const changeSelectionRange: ChangeSelectionRange = ({
		moveTo,
		nextSelectionSameGapType,
		nextSelectionStartGapType,
		nextSelectionEndGapType,
		replaceSelectionMarkdown,
	}) => {
		const changeValueParam = makeChangeValueParam({
			e,
			value,
			moveTo,
			nextSelectionSameGapType,
			nextSelectionStartGapType,
			nextSelectionEndGapType,
			replaceSelectionMarkdown,
		});

		changeValue(changeValueParam);
	};

	const toggleSelectionRange = (styledTextType: StyledTextType) => {
		changeSelectionRange({
			nextSelectionSameGapType: 'include',
			nextSelectionStartGapType: 'include',
			nextSelectionEndGapType: 'include',
			replaceSelectionMarkdown: ({
				prevSelectionMarkdown,
				selectionMarkdown,
				nextSelectionMarkdown,
			}) => {
				return `${prevSelectionMarkdown}${toggleStyledText({
					styledTextType,
					markdown: selectionMarkdown,
				})}${nextSelectionMarkdown}`;
			},
		});
	};

	return {
		changeSelectionRange,
		toggleSelectionRange,
	};
};
