import jsEslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import svelteParser from 'svelte-eslint-parser';

import tabroom from './config/eslint-tabroom.js';
import pluginImport from 'eslint-plugin-import';

import globals from 'globals';

const ignores = [
	'.DS_Store',
	'.env',
	'.env.*',
	'.github',
	'.svelte-kit/**/*',
	'.vscode',
	'node_modules/**/*',
	'build/**/*',
	'package/**/*',
	'package-lock.json',
	'**/*.test.js',
	'config/*',
	'.gitignore',
];

const testingDSL = {
	it       : 'readonly',
	expect   : 'readonly',
	describe : 'readonly',
};

export default [
	{ ignores },
	jsEslint.configs.recommended,
	...tsEslint.configs.recommended,
	...svelte.configs.recommended,
	tabroom,
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsEslint.parser,
			},
			globals: {
				...globals.browser,
			},
		},
		rules: {
			semi: 'warn',
			'svelte/sort-attributes': 'warn',
		},
	},
	{
		files: ['**/*.svelte.test.ts'],
		languageOptions: {
			parser: svelteParser,
			parserOptions: {
				parser: tsEslint.parser,
			},
			globals: {
				...globals.browser,
				...testingDSL,
			},
		},
		rules: {
			semi: 'warn',
			'svelte/sort-attributes': 'warn',
		},
	},
	{
		files: ['**/*.ts'],
		languageOptions: {
			parser: tsEslint.parser,
		},
		rules: {
			semi: 'warn',
			'svelte/sort-attributes': 'warn',
		},
	},
	{
		files: ['**/*.test.ts'],
		languageOptions: {
			parser: tsEslint.parser,
			globals: {
				...testingDSL,
			},
		},
	},
	{
		files: ['**/*server.ts'],
		languageOptions: {
			parser: tsEslint.parser,
			globals: {
				...globals.node,
			},
		},
		rules: {
			semi: 'warn',
			'svelte/sort-attributes': 'warn',
		},
	},
	{
		files: ['**/*server.test.ts'],
		languageOptions: {
			parser: tsEslint.parser,
			globals: {
				...globals.node,
				...testingDSL,
			},
		},
	},
	{
		plugins: {
			'@typescript-eslint': tsEslint.plugin,
			import: pluginImport,
		},
		rules: {
			semi: 'warn',
			'svelte/sort-attributes': 'warn',
		},
	},
];
