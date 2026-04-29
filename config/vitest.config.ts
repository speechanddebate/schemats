import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'vitest/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteTesting } from '@testing-library/svelte/vite';
import { playwright } from '@vitest/browser-playwright';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';

const dirname =
	typeof __dirname !== 'undefined'
		? __dirname
		: path.dirname(fileURLToPath(import.meta.url));

const STORYBOOK_VIEWPORT = process.env.STORYBOOK_VIEWPORT ?? 'desktop';
const storybookViewport =
	STORYBOOK_VIEWPORT === 'mobile'
		? { width: 390, height: 844 }
		: { width: 1280, height: 800 };

export default defineConfig({
	plugins: [sveltekit(), svelteTesting()],
	test: {
		projects: [
			{
				extends: true,
				test: {
					name: 'unit',
					globals: true,
					include: ['src/**/*.test.{js,ts}'],
					environment: 'jsdom',
					setupFiles: ['./config/testing/vitest-setup.ts'],
				},
			},
			{
				extends: true,
				plugins: [
					storybookTest({
						configDir: path.join(dirname, '../.storybook'),
					}),
				],
				test: {
					name: 'storybook',
					browser: {
						enabled: true,
						headless: true,
						provider: playwright({ contextOptions: { viewport: storybookViewport } }),
						instances: [{ browser: 'chromium' }, { browser: 'firefox' }],
					},
				},
			},
		],
	},
});
