/** @type {import('vite').UserConfig} */
import { defineConfig, loadEnv } from 'vite';
import { sveltekit } from '@sveltejs/kit/vite';

export default defineConfig( ({ mode }) => {

	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [ sveltekit() ],
		build	: {
			target : 'es2022',
		},
		test: {
			include: ['src/**/*.{test,spec}.{js,ts}'],
		},
		server: {
			host         : env.VITE_WEB_URL || 'localhost',
			port         : parseInt(env.VITE_PORT) || 9000,
			strictPort   : true,
			fs: {
				allow: ['.', './config'],
			},
			hmr: {
				clientPort : parseInt(env.VITE_CLIENT_PORT) || 9000,
			},
			proxy: {
				'/v1': {
					target: env.VITE_API_HOST || 'http://localhost:8001',
					changeOrigin: true,
				},
			},
		},
		preview: {
			port       : parseInt(env.VITE_PREVIEW_PORT) || 9003,
			strictPort : true,
			open       : false,
		},
	};
});
