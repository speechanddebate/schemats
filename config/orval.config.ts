import path from 'node:path';
import { defineConfig } from 'orval';
import config from './config.ts';

export default defineConfig({
	indexcards: {
		input: {
			target: config.indexcards.host + config.indexcards.basePath,
			filters: {
				tags: ['Orval'],
			},
		},
		output: {
			client: 'svelte-query',
			baseUrl: config.indexcards.basePath,  // Just /v1 for proxy
			mock: true,
			mode: 'split',
			target: path.resolve(process.cwd(), 'src/indexcards/index.ts'),
			schemas: path.resolve(process.cwd(), 'src/indexcards/schemas'),
			override: {
				query: {
					useInfinite: true,
					useInfiniteQueryParam: 'offset',
				},
				requestOptions: {
					credentials: 'include',
				},
				mutator: {
					path: path.resolve(process.cwd(), 'src/indexcards/utils.ts'),
					name: 'orvalMutator',
				},
			},
		},
		hooks: {
			afterAllFilesWrite: 'prettier --write --config ./config/prettier.config.ts',
		},
	},
});