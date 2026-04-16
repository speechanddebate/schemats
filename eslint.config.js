import { defineConfig } from 'eslint/config';
//plugins
import vitest from '@vitest/eslint-plugin';
import storybook from 'eslint-plugin-storybook';
import jsEslint from '@eslint/js';
import json from '@eslint/json';
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
	'.svelte-kit/**/*',
	'.vscode',
	'node_modules/**/*',
	'build/**/*',
	'test-results/**/*',
	'package/**/*',
	'package-lock.json',
	//ingore generated indexcards api client
	'**/indexcards/schemas/**/*',
	'**/indexcards/index.ts',
	'**/indexcards/index.msw.ts',
];

export default defineConfig([
	{ ignores },
	storybook.configs['flat/recommended'],
	{
		...tabroom,
		files: ['**/*.{js,ts,svelte}'],
	},
	{
		name: 'Svelte files',
		files: ['**/*.svelte*'],
		extends: [svelte.configs['flat/recommended'], tsEslint.configs.recommended],
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
		extends: [vitest.configs.recommended],
		rules: {
			'vitest/no-importing-vitest-globals': 'error',
		},
	},
	{
		name: 'JavaScript files',
		files: ['**/*.js'],
		extends: [jsEslint.configs.recommended],
	},
	{
		files: ['**/*.ts'],
		extends: [tsEslint.configs.recommended],
		languageOptions: {
			parser: tsEslint.parser,
		},
		rules: {
			semi: 'warn',
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
		files: ['**/*.{js,ts,svelte}'],
		plugins: {
			'@typescript-eslint': tsEslint.plugin,
			import: pluginImport,
		},
		rules: {
			semi: 'warn',
		},
	},
	{
		files: ['**/*.json'],
		plugins: { json },
		language: 'json/json',
		extends: ['json/recommended'],
	},
]);

