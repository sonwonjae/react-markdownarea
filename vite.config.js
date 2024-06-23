import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			name: '@sonwonjae/react-markdownarea',
			fileName: (format) => {
				return `index.${format}.js`;
			},
		},
		rollupOptions: {
			external: ['react', 'react-dom'],
			output: {
				globals: {
					react: 'React',
					'react-dom': 'ReactDOM',
				},
			},
		},
		outDir: 'lib',
		sourcemap: true,
		emptyOutDir: true,
	},
	plugins: [
		react(),
		dts({
			/** NOTE: build 시 필요없는 파일 제외 */
			exclude: [
				'node_modules',
				'src/app',
				'**/*.config.ts',
				'**/*.config.js',
				'**/*.config.mjs',
				'**/prettierrc.base.js',
				'next-env.d.ts',
				'.next/types/**/*.ts',
				// NOTE: test tool 제외
				'cypress',
				'**/*.cy.ts',
				'**/*.cy.tsx',
			],
		}),
	],
	resolve: {
		alias: [{ find: '@', replacement: path.resolve(__dirname, 'src') }],
	},
});
