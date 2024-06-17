import type { ComponentProps, RefObject } from 'react';

export interface ChangeValueParam {
	/** 새롭게 적용할 value [=e.currentTarget.value] */
	newValue?: string;
	/** 새롭게 적용할 selectionStart [=e.currentTarget.selectionStart] */
	nextSelectionStart?: number;
	/** 새롭게 적용할 selectionEnd */
	nextSelectionEnd?: number;
}

export interface ChangeValue {
	(param?: ChangeValueParam): void;
}

export interface MarkdownareaValueContextValue {
	markdownareaRef: RefObject<HTMLTextAreaElement>;
	onChange: ComponentProps<'textarea'>['onChange'];
}
