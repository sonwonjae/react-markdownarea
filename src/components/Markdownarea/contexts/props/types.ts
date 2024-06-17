import type { ComponentProps } from 'react';

export interface MarkdownareaPropsProviderProps
	extends ComponentProps<'textarea'> {
	value: string;
	onChange: ComponentProps<'textarea'>['onChange'];
	onKeyDown: ComponentProps<'textarea'>['onKeyDown'];
}

export interface MarkdownareaPropsContextValue
	extends Omit<MarkdownareaPropsProviderProps, 'onChange' | 'onKeyDown'> {
	onChangeInherit: MarkdownareaPropsProviderProps['onChange'];
	onKeyDownInherit: MarkdownareaPropsProviderProps['onKeyDown'];
}
