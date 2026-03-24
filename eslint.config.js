import { defineConfig } from 'eslint/config';
//plugins
import vitest from '@vitest/eslint-plugin';
import storybook from 'eslint-plugin-storybook';
import jsEslint from '@eslint/js';
import tsEslint from 'typescript-eslint';
import svelte from 'eslint-plugin-svelte';
import tabroom from './config/eslint-tabroom.js';

import pluginImport from 'eslint-plugin-import';
import globals from 'globals';
import svelteParser from 'svelte-eslint-parser';

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
	//ingore generated indexcards api client
	'**/indexcards/schemas/**/*',
	'**/indexcards/index.ts',
	'**/indexcards/index.msw.ts',
];

export default defineConfig([
	{ ignores },
	vitest.configs.recommended,
	jsEslint.configs.recommended,
	tsEslint.configs.recommended,
	svelte.configs['flat/recommended'],
	tabroom,
	storybook.configs['flat/recommended'],
	{
		name: 'Svelte files',
		files: ['**/*.svelte*'],
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
			'svelte/no-at-html-tags'            : 'off',
			'svelte/no-navigation-without-resolve': 'off',
			'svelte/sort-attributes': 'warn',
		},
	},
	{
		name: 'Test Files',
		files: ['src/**/*.test.{js,ts}'], //matches vite.config.ts
		rules: {
			'vitest/no-importing-vitest-globals': 'error',
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
]);

