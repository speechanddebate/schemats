import path from 'node:path';
import { defineConfig } from 'orval';
import config from './config.js';

export default defineConfig({
  indexcards: {
    input: {
      target: config.indexcards.host + config.indexcards.basePath,
      filters: {
        tags: ['Auth', 'test'],
      },
    },
    output: {
      client: 'svelte-query',
	  baseUrl: config.indexcards.basePath,  // Just /v1 for proxy
      mode: 'split',
	  prettier: true,
      target: path.resolve(process.cwd(), 'src/indexcards/index.ts'),
      schemas: path.resolve(process.cwd(), 'src/indexcards/schemas'),
      override: {
        requestOptions: {
          credentials: 'include',
        },
        mutator: {
          path: path.resolve(process.cwd(), 'src/indexcards/utils.ts'),
          name: 'orvalMutator',
        },
      },
    },
  },
});