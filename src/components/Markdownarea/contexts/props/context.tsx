import { createContext, useContext, useMemo } from 'react';

import {
	MarkdownareaPropsProviderProps,
	MarkdownareaPropsContextValue,
} from './types';

const MarkdownareaPropsContext = createContext<MarkdownareaPropsContextValue>({
	value: '',
	onChangeInherit: () => {},
	onKeyDownInherit: () => {},
});

export const useMarkdownareaPropsContext = () => {
	return useContext(MarkdownareaPropsContext);
};

export function MarkdownareaPropsProvider({
	children,
	onChange,
	onKeyDown,
	...props
}: MarkdownareaPropsProviderProps) {
	const contextValue = useMemo(() => {
		return {
			onChangeInherit: onChange,
			onKeyDownInherit: onKeyDown,
			...props,
		};
	}, [onChange, onKeyDown, JSON.stringify(props)]);

	return (
		<MarkdownareaPropsContext.Provider value={contextValue}>
			{children}
		</MarkdownareaPropsContext.Provider>
	);
}
