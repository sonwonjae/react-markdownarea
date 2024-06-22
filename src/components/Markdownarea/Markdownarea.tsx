import type { MarkdownareaPropsProviderProps } from './contexts/props/types';

import { memo } from 'react';

import { MarkdownareaHistoryProvider } from './contexts/history';
import {
	MarkdownareaKeymapProvider,
	useMarkdownareaKeymapContext,
} from './contexts/keymap';
import { MarkdownareaPropsProvider } from './contexts/props';
import {
	MarkdownareaValueProvider,
	useMarkdownareaValueContext,
} from './contexts/value';

function MarkdownareaComponent() {
	const { markdownareaRef } = useMarkdownareaValueContext();
	const { onChange } = useMarkdownareaValueContext();
	const { onKeyDown } = useMarkdownareaKeymapContext();

	return (
		<textarea
			ref={markdownareaRef}
			autoComplete="off"
			spellCheck="false"
			onKeyDown={onKeyDown}
			onChange={onChange}
		/>
	);
}

const MemoizedMarkdownareaComponent = memo(MarkdownareaComponent);

export default function Markdownarea({
	value,
	onChange,
	onKeyDown,
	...props
}: MarkdownareaPropsProviderProps) {
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
						<MemoizedMarkdownareaComponent />
					</MarkdownareaKeymapProvider>
				</MarkdownareaValueProvider>
			</MarkdownareaHistoryProvider>
		</MarkdownareaPropsProvider>
	);
}
