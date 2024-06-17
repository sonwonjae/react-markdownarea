import type { MarkdownareaKeymapContextValue } from './types';
import type { PropsWithChildren } from 'react';

import { createContext, useContext, useMemo } from 'react';

import { useMarkdownareaHistoryContext } from '@/components/Markdownarea/contexts/history';
import { useMarkdownareaPropsContext } from '@/components/Markdownarea/contexts/props';
import {
	getIsEmptyMarkdown,
	getMarkdownTabCount,
	getMarkdownType,
	parseTabCountToTab,
	parseToPureMarkdown,
	parseValueToMarkdownList,
	splitMarkdownOfSyntax,
} from '@/utils/markdown';
import { getMarkdownSelectionStartWithMarkdownList } from '@/utils/markdown/selection';

import { makeChangeValueUtil } from './utils/changeValue';

const MarkdownareaKeymapContext = createContext<MarkdownareaKeymapContextValue>(
	{
		onKeyDown: () => {},
	},
);

export const useMarkdownareaKeymapContext = () => {
	return useContext(MarkdownareaKeymapContext);
};

export function MarkdownareaKeymapProvider({ children }: PropsWithChildren) {
	const { value, onKeyDownInherit } = useMarkdownareaPropsContext();
	const { recordHistory, undo, redo } = useMarkdownareaHistoryContext();

	const onKeyDown: MarkdownareaKeymapContextValue['onKeyDown'] = (e) => {
		const key = e.key.toLocaleUpperCase();
		const { changeSelectionRange, toggleSelectionRange } =
			makeChangeValueUtil({
				e,
				onKeyDownInherit,
				recordHistory,
				value,
			});

		/** NOTE: enter key event */
		if (key === 'ENTER') {
			const { indexInMarkdown, indexInMarkdownList } =
				getMarkdownSelectionStartWithMarkdownList({
					value: e.currentTarget.value,
					selectionIndex: e.currentTarget.selectionStart,
				});
			const currentLinePrevSelectionMarkdown = parseValueToMarkdownList(
				e.currentTarget.value,
			)[indexInMarkdownList]!.slice(0, indexInMarkdown);
			const currentLinePrevSelectionMarkdownType = getMarkdownType(
				currentLinePrevSelectionMarkdown,
			);

			if (currentLinePrevSelectionMarkdownType === 'blockquote') {
				const { text: remainedMarkdown } = splitMarkdownOfSyntax(
					currentLinePrevSelectionMarkdown,
				);

				const remainedMarkdownType = getMarkdownType(remainedMarkdown);

				if (
					remainedMarkdownType === 'uli' ||
					remainedMarkdownType === 'oli' ||
					remainedMarkdownType === 'cli-f' ||
					remainedMarkdownType === 'cli-e'
				) {
					changeSelectionRange({
						moveTo: 'last',
						nextSelectionSameGapType: 'include',
						nextSelectionStartGapType: 'include',
						nextSelectionEndGapType: 'include',
						replaceSelectionMarkdown: ({
							type,
							prevSelectionMarkdown,
							selectionMarkdown,
							nextSelectionMarkdown,
						}) => {
							if (type === 'same-selection') {
								const {
									syntax: blockquoteSyntax,
									text: prevSelectionRemainedMarkdown,
								} = splitMarkdownOfSyntax(
									prevSelectionMarkdown,
								);

								const prevSelectionRemainedMarkdownType =
									getMarkdownType(
										prevSelectionRemainedMarkdown,
									);

								const currentLineMarkdown = `${prevSelectionRemainedMarkdown}${selectionMarkdown}${nextSelectionMarkdown}`;
								const currentLineTabCount =
									getMarkdownTabCount(currentLineMarkdown);
								const currentLineTab =
									parseTabCountToTab(currentLineTabCount);
								const hasCurrentLineTab = !!currentLineTabCount;
								const isEmptyMarkdown = getIsEmptyMarkdown({
									markdown: currentLineMarkdown,
									markdownType:
										prevSelectionRemainedMarkdownType,
								});

								if (isEmptyMarkdown && hasCurrentLineTab) {
									return currentLineMarkdown.replace(
										new RegExp(`^${blockquoteSyntax}\t`),
										'$1',
									);
								}
								if (isEmptyMarkdown && !hasCurrentLineTab) {
									return blockquoteSyntax;
								}
								if (!isEmptyMarkdown) {
									const pureMarkdown = parseToPureMarkdown(
										prevSelectionRemainedMarkdown,
									);

									const { syntax } =
										splitMarkdownOfSyntax(pureMarkdown);

									return `${prevSelectionMarkdown}\n${blockquoteSyntax}${currentLineTab}${syntax}${selectionMarkdown}${nextSelectionMarkdown}`;
								}
							}

							if (type === 'same-line') {
								const {
									syntax: blockquoteSyntax,
									text: prevSelectionRemainedMarkdown,
								} = splitMarkdownOfSyntax(
									prevSelectionMarkdown,
								);

								const prevSelectionRemainedMarkdownType =
									getMarkdownType(
										prevSelectionRemainedMarkdown,
									);

								const currentLineMarkdown = `${prevSelectionRemainedMarkdown}${nextSelectionMarkdown}`;
								const currentLineTabCount =
									getMarkdownTabCount(currentLineMarkdown);
								const currentLineTab =
									parseTabCountToTab(currentLineTabCount);
								const hasCurrentLineTab = !!currentLineTabCount;
								const isEmptyMarkdown = getIsEmptyMarkdown({
									markdown: currentLineMarkdown,
									markdownType:
										prevSelectionRemainedMarkdownType,
								});

								if (isEmptyMarkdown && hasCurrentLineTab) {
									return currentLineMarkdown.replace(
										new RegExp(`^${blockquoteSyntax}\t`),
										'$1',
									);
								}
								if (isEmptyMarkdown && !hasCurrentLineTab) {
									return blockquoteSyntax;
								}
								if (!isEmptyMarkdown) {
									const pureMarkdown = parseToPureMarkdown(
										prevSelectionRemainedMarkdown,
									);

									const { syntax } =
										splitMarkdownOfSyntax(pureMarkdown);

									return `${prevSelectionMarkdown}\n${blockquoteSyntax}${currentLineTab}${syntax}${nextSelectionMarkdown}`;
								}
							}

							if (type === 'first-line') {
								return `${prevSelectionMarkdown}`;
							}
							if (type === 'last-line') {
								return `${nextSelectionMarkdown}`;
							}

							return null;
						},
					});
					return;
				}
			}

			if (
				currentLinePrevSelectionMarkdownType === 'uli' ||
				currentLinePrevSelectionMarkdownType === 'oli' ||
				currentLinePrevSelectionMarkdownType === 'cli-f' ||
				currentLinePrevSelectionMarkdownType === 'cli-e' ||
				currentLinePrevSelectionMarkdownType === 'blockquote'
			) {
				changeSelectionRange({
					moveTo: 'last',
					nextSelectionSameGapType: 'include',
					nextSelectionStartGapType: 'include',
					nextSelectionEndGapType: 'include',
					replaceSelectionMarkdown: ({
						type,
						prevSelectionMarkdown,
						selectionMarkdown,
						nextSelectionMarkdown,
					}) => {
						if (type === 'same-selection') {
							const currentLineMarkdown = `${prevSelectionMarkdown}${selectionMarkdown}${nextSelectionMarkdown}`;
							const currentLineTabCount =
								getMarkdownTabCount(currentLineMarkdown);
							const currentLineTab =
								parseTabCountToTab(currentLineTabCount);
							const hasCurrentLineTab = !!currentLineTabCount;
							const isEmptyMarkdown = getIsEmptyMarkdown({
								markdown: currentLineMarkdown,
								markdownType:
									currentLinePrevSelectionMarkdownType,
							});

							if (isEmptyMarkdown && hasCurrentLineTab) {
								return currentLineMarkdown.replace(/^(\t)/, '');
							}
							if (isEmptyMarkdown && !hasCurrentLineTab) {
								return '';
							}
							if (!isEmptyMarkdown) {
								const pureMarkdown = parseToPureMarkdown(
									currentLinePrevSelectionMarkdown,
								);

								const { syntax } =
									splitMarkdownOfSyntax(pureMarkdown);

								return `${prevSelectionMarkdown}\n${currentLineTab}${syntax}${selectionMarkdown}${nextSelectionMarkdown}`;
							}
						}
						if (type === 'same-line') {
							const currentLineMarkdown = `${prevSelectionMarkdown}${nextSelectionMarkdown}`;
							const currentLineTabCount =
								getMarkdownTabCount(currentLineMarkdown);
							const currentLineTab =
								parseTabCountToTab(currentLineTabCount);
							const hasCurrentLineTab = !!currentLineTabCount;
							const isEmptyMarkdown = getIsEmptyMarkdown({
								markdown: currentLineMarkdown,
								markdownType:
									currentLinePrevSelectionMarkdownType,
							});

							if (isEmptyMarkdown && hasCurrentLineTab) {
								return currentLineMarkdown.replace(/^(\t)/, '');
							}
							if (isEmptyMarkdown && !hasCurrentLineTab) {
								return '';
							}
							if (!isEmptyMarkdown) {
								const pureMarkdown = parseToPureMarkdown(
									currentLinePrevSelectionMarkdown,
								);

								const { syntax } =
									splitMarkdownOfSyntax(pureMarkdown);

								return `${prevSelectionMarkdown}\n${currentLineTab}${syntax}${nextSelectionMarkdown}`;
							}
						}

						if (type === 'first-line') {
							return `${prevSelectionMarkdown}`;
						}
						if (type === 'last-line') {
							return `${nextSelectionMarkdown}`;
						}

						return null;
					},
				});
				return;
			}
		}

		/** NOTE: shift tab key event */
		if (e.shiftKey && key === 'TAB') {
			changeSelectionRange({
				nextSelectionSameGapType: 'exclude',
				nextSelectionStartGapType: 'exclude',
				nextSelectionEndGapType: 'include',
				replaceSelectionMarkdown: ({
					prevSelectionMarkdown,
					selectionMarkdown,
					nextSelectionMarkdown,
				}) => {
					const currentLineMarkdown = `${prevSelectionMarkdown}${selectionMarkdown}${nextSelectionMarkdown}`;
					const markdownType = getMarkdownType(currentLineMarkdown);

					if (markdownType === 'blockquote') {
						if (/^> /.test(currentLineMarkdown)) {
							return currentLineMarkdown;
						}
						return currentLineMarkdown.replace(/^>/, '');
					}

					return currentLineMarkdown.replace(/^\t/, '');
				},
			});
			return;
		}

		/** NOTE: tab key event */
		if (key === 'TAB') {
			changeSelectionRange({
				nextSelectionSameGapType: 'exclude',
				nextSelectionStartGapType: 'exclude',
				nextSelectionEndGapType: 'include',
				replaceSelectionMarkdown: ({
					prevSelectionMarkdown,
					selectionMarkdown,
					nextSelectionMarkdown,
				}) => {
					const currentLineMarkdown = `${prevSelectionMarkdown}${selectionMarkdown}${nextSelectionMarkdown}`;
					const markdownType = getMarkdownType(currentLineMarkdown);

					if (markdownType === 'blockquote') {
						return `>${currentLineMarkdown}`;
					}

					return `\t${currentLineMarkdown}`;
				},
			});
			return;
		}

		/** NOTE: shortcut key - styled text */
		/** NOTE: bold */
		if ((e.ctrlKey || e.metaKey) && key === 'B') {
			toggleSelectionRange('bold');
			return;
		}
		/** NOTE: italic */
		if ((e.ctrlKey || e.metaKey) && key === 'I') {
			toggleSelectionRange('italic');
			return;
		}
		/** NOTE: strike-through */
		if ((e.ctrlKey || e.metaKey) && key === 'D') {
			toggleSelectionRange('strike-through');
			return;
		}
		/** NOTE: code */
		if ((e.ctrlKey || e.metaKey) && key === 'E') {
			toggleSelectionRange('code');
			return;
		}
		/** NOTE: link */
		if ((e.ctrlKey || e.metaKey) && key === 'K') {
			changeSelectionRange({
				nextSelectionSameGapType: 'include',
				nextSelectionStartGapType: 'include',
				nextSelectionEndGapType: 'include',
				replaceSelectionMarkdown: ({
					prevSelectionMarkdown,
					selectionMarkdown,
					nextSelectionMarkdown,
				}) => {
					return `${prevSelectionMarkdown}[${selectionMarkdown}]()${nextSelectionMarkdown}`;
				},
			});
			return;
		}

		/** NOTE: ` wrap */
		if (key === '`') {
			changeSelectionRange({
				nextSelectionSameGapType: 'exclude-half',
				nextSelectionStartGapType: 'exclude',
				nextSelectionEndGapType: 'exclude',
				replaceSelectionMarkdown: ({
					type,
					prevSelectionMarkdown,
					selectionMarkdown,
					nextSelectionMarkdown,
				}) => {
					const isStartCodeBlock = /(``)$/.test(
						prevSelectionMarkdown,
					);
					const startSyntax = isStartCodeBlock
						? `${key}\n`
						: `${key}`;
					const prevSelectionMarkdownWithStartSyntax =
						isStartCodeBlock
							? prevSelectionMarkdown.replace(/(``)$/, '\n``')
							: prevSelectionMarkdown;

					const isEndCodeBlock = /^(``)/.test(nextSelectionMarkdown);
					const endSyntax = isEndCodeBlock ? `\n${key}` : `${key}`;
					const nextSelectionMarkdownWithEndSyntax = isEndCodeBlock
						? nextSelectionMarkdown.replace(/^(``)/, '``\n')
						: nextSelectionMarkdown;

					switch (type) {
						case 'first-line':
							return `${prevSelectionMarkdownWithStartSyntax}${startSyntax}${selectionMarkdown}${nextSelectionMarkdown}`;
						case 'selection-line':
							return `${prevSelectionMarkdownWithStartSyntax}${selectionMarkdown}${nextSelectionMarkdownWithEndSyntax}`;
						case 'last-line':
							return `${prevSelectionMarkdown}${selectionMarkdown}${endSyntax}${nextSelectionMarkdownWithEndSyntax}`;
						case 'same-selection':
						case 'same-line':
						default:
							return `${prevSelectionMarkdownWithStartSyntax}${startSyntax}${selectionMarkdown}${endSyntax}${nextSelectionMarkdownWithEndSyntax}`;
					}
				},
			});
			return;
		}
		/** NOTE: wrap - *, ~, = */
		if (key === '*' || key === '~' || key === '=') {
			changeSelectionRange({
				nextSelectionSameGapType: 'exclude-half',
				nextSelectionStartGapType: 'include',
				nextSelectionEndGapType: 'include',
				replaceSelectionMarkdown: ({
					type,
					prevSelectionMarkdown,
					selectionMarkdown,
					nextSelectionMarkdown,
				}) => {
					switch (type) {
						case 'same-selection':
							return `${prevSelectionMarkdown}${key}${nextSelectionMarkdown}`;
						case 'first-line':
						case 'last-line':
						case 'selection-line':
						case 'same-line':
						default:
							return `${prevSelectionMarkdown}${key}${selectionMarkdown}${key}${nextSelectionMarkdown}`;
					}
				},
			});
			return;
		}
		/** NOTE: wrap - (), {}, [] */
		if (key === '(' || key === '{' || key === '[') {
			const MATCH_MAP = {
				'(': ')',
				'{': '}',
				'[': ']',
			};

			changeSelectionRange({
				nextSelectionSameGapType: 'exclude-half',
				nextSelectionStartGapType: 'include',
				nextSelectionEndGapType: 'include',
				replaceSelectionMarkdown: ({
					prevSelectionMarkdown,
					selectionMarkdown,
					nextSelectionMarkdown,
				}) => {
					return `${prevSelectionMarkdown}${key}${selectionMarkdown}${MATCH_MAP[key]}${nextSelectionMarkdown}`;
				},
			});
			return;
		}

		/** NOTE: shortcut key - undo/redo */
		if ((e.ctrlKey || e.metaKey) && e.shiftKey && key === 'Z') {
			redo(e);
			return;
		}
		if ((e.ctrlKey || e.metaKey) && key === 'Z') {
			undo(e);
			return;
		}
	};

	const contextValue = useMemo(() => {
		return { onKeyDown };
	}, [onKeyDown]);

	return (
		<MarkdownareaKeymapContext.Provider value={contextValue}>
			{children}
		</MarkdownareaKeymapContext.Provider>
	);
}
