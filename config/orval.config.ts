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
			baseUrl: {
				runtime: 'indexcardsApiBaseUrl()',
				imports: [{ name: 'indexcardsApiBaseUrl', importPath: '$indexcards/runtime' }],
			},
			mock: true,
			mode: 'split',
			target: path.resolve(process.cwd(), 'src/indexcards/index.ts'),
			schemas: path.resolve(process.cwd(), 'src/indexcards/schemas'),
			override: {
				query: {
					useInfinite: true,
					usePrefetch: true,
					useInfiniteQueryParam: 'offset',
				},
				fetch: {
					useRuntimeFetcher: true,
				},
				requestOptions: {
					credentials: 'include',
				},
			},
		},
		hooks: {
			afterAllFilesWrite: 'prettier --write --config ./config/prettier.config.ts',
		},
	},
});