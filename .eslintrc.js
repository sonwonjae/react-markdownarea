const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

/** @type {import("eslint").Linter.Config} */
module.exports = {
	root: true,
	extends: ['eslint:recommended', 'turbo', 'plugin:prettier/recommended'],
	parser: '@typescript-eslint/parser',
	env: {
		browser: true,
		node: true,
	},
	plugins: ['@typescript-eslint', 'import'],
	globals: {
		React: true,
		JSX: true,
	},
	settings: {
		'import/resolver': {
			typescript: {
				project,
			},
		},
	},
	rules: {
		'arrow-body-style': ['error', 'always'], // 화살표 함수라도 항상 함수 바디가 있도록 강제함
		'consistent-return': 'off', // 모든 함수에 꼭 return이 없어도 되도록 허용
		'no-tabs': 'off',
		'object-curly-newline': 'off',
		'no-param-reassign': [
			'error',
			{
				ignorePropertyModificationsForRegex: ['^draft.'],
			},
		],
		'no-underscore-dangle': 'off',
		// for prettier
		'operator-linebreak': [
			'error',
			'after',
			{ overrides: { '?': 'before', ':': 'before' } },
		],
		'implicit-arrow-linebreak': 'off',
		'@typescript-eslint/naming-convention': 'off',
		'no-useless-return': 'off',
		'no-unused-vars': 'off',
		'@typescript-eslint/no-unused-vars': [
			'error',
			// NOTE: _로 시작하고 끝나는 변수는 사용하지 않아도 error 취급 안함
			{ argsIgnorePattern: '^(_+)$', varsIgnorePattern: '^(_+)$' },
		],
		'import/order': [
			'error',
			{
				groups: [
					'type',
					'builtin',
					'external',
					'internal',
					'parent',
					'sibling',
					'index',
					'unknown',
					'object',
				],
				pathGroups: [
					{
						pattern: '@/**',
						group: 'internal',
						position: 'before',
					},
				],
				'newlines-between': 'always',
				alphabetize: {
					order: 'asc',
					caseInsensitive: true,
				},
				pathGroupsExcludedImportTypes: ['type'],
			},
		],
	},
	ignorePatterns: [
		// Ignore dotfiles
		'.*.js',
		'node_modules/',
		'dist/',
		'lib/',
	],
	overrides: [
		{
			files: ['*.js?(x)', '*.ts?(x)'],
		},
	],
	parserOptions: {
		project: true,
	},
};
