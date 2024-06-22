import type { MarkdownareaValueContextValue } from './types';
import type { PropsWithChildren } from 'react';

import { createContext, useContext, useMemo } from 'react';

import { useMarkdownareaHistoryContext } from '@/components/Markdownarea/contexts/history';
import { useMarkdownareaPropsContext } from '@/components/Markdownarea/contexts/props';
import { reorderOli } from '@/utils/markdown';

const MarkdownareaValueContext = createContext<MarkdownareaValueContextValue>({
	onChange: () => {},
});

export const useMarkdownareaValueContext = () => {
	return useContext(MarkdownareaValueContext);
};

export function MarkdownareaValueProvider({ children }: PropsWithChildren) {
	const { onChangeInherit } = useMarkdownareaPropsContext();
	const { recordHistory } = useMarkdownareaHistoryContext();

	const onChange: MarkdownareaValueContextValue['onChange'] = (e) => {
		const { reorderdValue, nextSelectionStart: finalSelectionStart } =
			reorderOli({
				value: e.currentTarget.value,
				selectionStart: e.currentTarget.selectionStart,
			});

		e.target.value = reorderdValue;
		e.currentTarget.value = reorderdValue;
		e.currentTarget.setSelectionRange(
			finalSelectionStart,
			e.currentTarget.selectionEnd ?? finalSelectionStart,
		);
		onChangeInherit?.(e);

		recordHistory({
			value: e.currentTarget.value,
			selectionStart: finalSelectionStart,
			selectionEnd: e.currentTarget.selectionEnd,
		});
	};

	const contextValue = useMemo(() => {
		return { onChange };
	}, [onChange]);

	return (
		<MarkdownareaValueContext.Provider value={contextValue}>
			{children}
		</MarkdownareaValueContext.Provider>
	);
}
