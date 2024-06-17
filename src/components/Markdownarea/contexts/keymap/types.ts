import type { ComponentProps } from 'react';

declare global {
	/** NOTE: textarea change event에 e.nativeEvent.isComposing boolean 값이 있는데 없다고 선언되어 있어서 강제로 덮어씀 */
	interface Event {
		isComposing: boolean;
	}
}
export interface MarkdownareaKeymapContextValue {
	onKeyDown: ComponentProps<'textarea'>['onKeyDown'];
}

export type ReplaceSelectionMarkdownType =
	| 'same-selection'
	| 'same-line'
	| 'first-line'
	| 'last-line'
	| 'selection-line';

export interface ReplaceSelectionMarkdown {
	(param: {
		type: ReplaceSelectionMarkdownType;
		prevSelectionMarkdown: string;
		selectionMarkdown: string;
		nextSelectionMarkdown: string;
	}): string | null;
}

export type GapType = 'include' | 'exclude' | 'exclude-half';

export interface ChangeSelectionRange {
	(param: {
		moveTo?: 'first' | 'last';
		nextSelectionSameGapType: GapType;
		nextSelectionStartGapType: GapType;
		nextSelectionEndGapType: GapType;
		replaceSelectionMarkdown: ReplaceSelectionMarkdown;
	}): void;
}
