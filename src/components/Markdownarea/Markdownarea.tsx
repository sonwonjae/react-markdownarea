import type { MarkdownareaPropsProviderProps } from './contexts/props/types';

import { forwardRef } from 'react';

import { MarkdownareaHistoryProvider } from './contexts/history';
import {
	MarkdownareaKeymapProvider,
	useMarkdownareaKeymapContext,
} from './contexts/keymap';
import {
	MarkdownareaPropsProvider,
	useMarkdownareaPropsContext,
} from './contexts/props';
import {
	MarkdownareaValueProvider,
	useMarkdownareaValueContext,
} from './contexts/value';

const MarkdownareaComponent = forwardRef<HTMLTextAreaElement>((_, ref) => {
	const { ...props } = useMarkdownareaPropsContext();
	const { onChange } = useMarkdownareaValueContext();
	const { onKeyDown } = useMarkdownareaKeymapContext();

	return (
		<textarea
			ref={ref}
			autoComplete="off"
			spellCheck="false"
			onKeyDown={onKeyDown}
			onChange={onChange}
			{...props}
		/>
	);
});
MarkdownareaComponent.displayName = 'MarkdownareaComponent';

const Markdownarea = forwardRef<
	HTMLTextAreaElement,
	MarkdownareaPropsProviderProps
>(({ value, onChange, onKeyDown, ...props }, ref) => {
	return (
		<MarkdownareaPropsProvider
			value={value}
			onChange={onChange}
			onKeyDown={onKeyDown}
			{...props}
		>
			<MarkdownareaHistoryProvider>
				<MarkdownareaValueProvider>
					<MarkdownareaKeymapProvider>
						<MarkdownareaComponent ref={ref} />
					</MarkdownareaKeymapProvider>
				</MarkdownareaValueProvider>
			</MarkdownareaHistoryProvider>
		</MarkdownareaPropsProvider>
	);
});
Markdownarea.displayName = 'Markdownarea';

export default Markdownarea;
