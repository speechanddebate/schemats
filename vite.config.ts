/// <reference types="vitest/config" />
/** @type {import('vite').UserConfig} */
import { defineConfig } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';
import {svelteTesting} from '@testing-library/svelte/vite';
import { config } from 'dotenv';
config({ quiet: true });

export default defineConfig( () => {

	return {
		plugins: [ sveltekit(), svelteTesting()],
		build	: {
			target : 'es2022',
		},
		server: {
			host         : process.env.VITE_HOST ?? 'localhost',
			port         : process.env.VITE_PORT ? Number(process.env.VITE_PORT) : 9000,
			allowedHosts : [
				process.env.WEB_URL ?? 'localhost',
			],
			strictPort   : true,
			fs: {
				allow: ['.', './config'],
			},
			hmr: {
				clientPort : process.env.VITE_CLIENT_PORT ? Number(process.env.VITE_CLIENT_PORT) : 9003,
			},
			proxy: {
				'/v1': {
					target: process.env.INDEXCARDS_HOST,
					changeOrigin: true,
				},
			},
		},
		preview: {
			host       : process.env.VITE_HOST ?? 'localhost',
			port       : process.env.VITE_PREVIEW_PORT ? Number(process.env.VITE_PREVIEW_PORT) : 9000,
			strictPort : true,
			open       : false,
		},
	};
});