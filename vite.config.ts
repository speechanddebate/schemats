/// <reference types="vitest/config" />
/** @type {import('vite').UserConfig} */
import { defineConfig } from 'vite';
import config from './config/config';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig( () => {

	return {
		plugins: [ sveltekit() ],
		build	: {
			target : 'es2022',
		},
		test: {
			include: ['src/**/*.test.{js,ts}'],
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
			port       : config.vite.previewPort,
			strictPort : true,
			open       : false,
		},
	};
});