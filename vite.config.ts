/// <reference types="vitest/config" />
/** @type {import('vite').UserConfig} */
import { defineConfig } from 'vite';
import config from './config/config';
import { sveltekit } from '@sveltejs/kit/vite';
import {svelteTesting} from '@testing-library/svelte/vite';
import { playwright } from '@vitest/browser-playwright';

export default defineConfig( () => {

	return {
		plugins: [ sveltekit(), svelteTesting()],
		build	: {
			target : 'es2022',
		},
		test: {
			globals: true,
			include: ['src/**/*.test.{js,ts}'],
			environment: 'jsdom',
			browser: {
				enabled: true,
				provider: playwright({}),
				instances: [
					{ browser: 'chromium' },
				],
			},
			setupFiles: ['./config/testing/vitest-setup.ts'],
		},
		server: {
			host         : config.vite.host,
			port         : config.vite.port,
			strictPort   : true,
			fs: {
				allow: ['.', './config'],
			},
			hmr: {
				clientPort : config.vite.clientPort,
			},
			proxy: {
				'/v1': {
					target: config.indexcards.host,
					changeOrigin: true,
				},
			},
		},
		preview: {
			host       : config.vite.host,
			port       : config.vite.previewPort,
			strictPort : true,
			open       : false,
		},
	};
});