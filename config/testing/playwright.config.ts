import { defineConfig } from '@playwright/test';

const projectRoot = new URL('../..', import.meta.url).pathname;

export default defineConfig({
	testDir: projectRoot,
	webServer: {
		command: 'npx svelte-kit sync && npm run dev',
		cwd: projectRoot,
		port: process.env.VITE_PORT ? Number(process.env.VITE_PORT) : 9000,
		reuseExistingServer: !process.env.CI,
	},
	expect: {
		timeout: 5000,
	},
	testMatch: '**/*.e2e.{ts,js}',
});
