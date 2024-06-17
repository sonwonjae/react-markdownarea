import type {
	MarkdownareaHitories,
	MarkdownareaHistoryContextValue,
	RecordHistory,
	Undo,
	Redo,
} from './types';
import type { PropsWithChildren } from 'react';

import { createContext, useContext, useMemo, useState } from 'react';

import { useMarkdownareaPropsContext } from '@/components/Markdownarea/contexts/props';

const MarkdownareaHistoryContext =
	createContext<MarkdownareaHistoryContextValue>({
		recordHistory: () => {},
		undo: () => {},
		redo: () => {},
	});

export const useMarkdownareaHistoryContext = () => {
	return useContext(MarkdownareaHistoryContext);
};

export function MarkdownareaHistoryProvider({ children }: PropsWithChildren) {
	const { value, onKeyDownInherit } = useMarkdownareaPropsContext();

	const [undoHistoryStack, setUndoHistoryStack] =
		useState<MarkdownareaHitories>([
			{ value: String(value), selectionStart: 0, selectionEnd: 0 },
		]);
	const [redoHistoryStack, setRedoHistoryStack] =
		useState<MarkdownareaHitories>([]);

	const recordHistory: RecordHistory = ({
		value,
		selectionStart,
		selectionEnd,
	}) => {
		setUndoHistoryStack([
			...undoHistoryStack,
			{
				value,
				selectionStart,
				selectionEnd,
			},
		]);
		setRedoHistoryStack([]);
	};

	const undo: Undo = (e) => {
		e.preventDefault();

		if (undoHistoryStack.length >= 2) {
			const undoedValueInfo = undoHistoryStack.pop()!;

			const newUndoHistoryStack = [...undoHistoryStack];
			const newRedoHistoryStack = [...redoHistoryStack, undoedValueInfo];

			setUndoHistoryStack(newUndoHistoryStack);
			setRedoHistoryStack(newRedoHistoryStack);

			e.currentTarget.value =
				newUndoHistoryStack[newUndoHistoryStack.length - 1]!.value ??
				'';
			e.currentTarget.setSelectionRange(
				newUndoHistoryStack[newUndoHistoryStack.length - 1]!
					.selectionStart,
				newUndoHistoryStack[newUndoHistoryStack.length - 1]!
					.selectionEnd,
			);
			onKeyDownInherit?.(e);
		}
	};

	const redo: Redo = (e) => {
		e.preventDefault();

		if (redoHistoryStack.length >= 1) {
			const redoedValueInfo = redoHistoryStack.pop()!;

			const newRedoHistoryStack = [...redoHistoryStack];
			const newUndoHistoryStack = [...undoHistoryStack, redoedValueInfo];

			setRedoHistoryStack(newRedoHistoryStack);
			setUndoHistoryStack(newUndoHistoryStack);

			e.currentTarget.value = redoedValueInfo.value;
			e.currentTarget.setSelectionRange(
				redoedValueInfo.selectionStart,
				redoedValueInfo.selectionEnd,
			);

			onKeyDownInherit?.(e);
		}
	};

	const contextValue = useMemo(() => {
		return { recordHistory, undo, redo };
	}, [recordHistory, undo, redo]);

	return (
		<MarkdownareaHistoryContext.Provider value={contextValue}>
			{children}
		</MarkdownareaHistoryContext.Provider>
	);
}
