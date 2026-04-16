import { defineConfig } from '@playwright/test';
import config from '../config.ts';

const projectRoot = new URL('../..', import.meta.url).pathname;

export default defineConfig({
	testDir: projectRoot,
	webServer: {
		command: 'npx svelte-kit sync && npm run build && npm run preview',
		cwd: projectRoot,
		port: config.vite.previewPort,
		reuseExistingServer: !process.env.CI,
	},
	testMatch: '**/*.e2e.{ts,js}',
});
