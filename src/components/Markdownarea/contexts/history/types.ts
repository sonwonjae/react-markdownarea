import type { KeyboardEvent as ReactKeyboardEvent } from 'react';

export interface MarkdownareaHistory {
	value: string;
	selectionStart: number;
	selectionEnd: number;
}

export type MarkdownareaHitories = Array<MarkdownareaHistory>;

export interface RecordHistory {
	(param: MarkdownareaHistory): void;
}

export interface Undo {
	(e: ReactKeyboardEvent<HTMLTextAreaElement>): void;
}

export interface Redo {
	(e: ReactKeyboardEvent<HTMLTextAreaElement>): void;
}

export interface MarkdownareaHistoryContextValue {
	recordHistory: RecordHistory;
	undo: Undo;
	redo: Redo;
}
