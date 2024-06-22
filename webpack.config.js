const { merge } = require('webpack-merge');
const path = require('path');

const common = {
	mode: 'production',
	entry: './src/index.ts',
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx'],
		alias: {
			'@': path.resolve(__dirname, './src'),
		},
	},
};

const cjs = {
	output: {
		filename: 'index.js',
		path: path.resolve(__dirname, 'lib/cjs'),
		libraryTarget: 'commonjs2',
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				loader: 'babel-loader',
			},
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				// exclude: /node_modules/,
				options: {
					configFile: path.resolve(__dirname, './tsconfig.cjs.json'),
				},
			},
		],
	},
};

const esm = {
	output: {
		filename: 'index.mjs',
		path: path.resolve(__dirname, 'lib/esm'),
		libraryTarget: 'module',
	},
	experiments: {
		outputModule: true,
	},
	module: {
		rules: [
			{
				test: /\.jsx?/,
				loader: 'babel-loader',
				options: {
					presets: ['@babel/preset-env', '@babel/preset-react'],
				},
			},
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
				options: {
					configFile: path.resolve(__dirname, './tsconfig.esm.json'),
				},
			},
		],
	},
};

module.exports = [merge(common, esm), merge(common, cjs)];
