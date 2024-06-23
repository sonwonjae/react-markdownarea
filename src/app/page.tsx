'use client';
import { useState } from 'react';

import { Markdownarea } from '@/components';

export default function Home() {
	const [value, setValue] = useState('');

	return (
		<main>
			<Markdownarea
				value={value}
				onChange={(e) => {
					setValue(e.target.value);
				}}
				onKeyDown={(e) => {
					setValue(e.currentTarget.value);
				}}
			/>
			<input
				value={value}
				onChange={(e) => {
					setValue(e.target.value);
				}}
			/>
		</main>
	);
}
