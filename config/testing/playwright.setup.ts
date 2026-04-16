// [playwright.setup.ts](http://_vscodecontentref_/3)
import { test as base, expect } from '@playwright/test';
import { defineNetworkFixture } from '@msw/playwright';
import type { AnyHandler } from 'msw';
import { getIndexCardsAPIMock } from '../../src/indexcards/index.msw';
import config from '../../config/config';

type Fixtures = {
  network: ReturnType<typeof defineNetworkFixture>;
  handlers: AnyHandler[];
};

const isApiRequest = (url: string): boolean => {
	return new URL(url).pathname.startsWith(config.indexcards.basePath);
};

export const test = base.extend<Fixtures>({
	handlers: async (_fixtures, use) => {
		await use(getIndexCardsAPIMock());
	},
	network: [
		async ({ context, handlers }, use) => {
			const network = defineNetworkFixture({
				context,
				handlers,
				onUnhandledRequest(request, print) {
					if (isApiRequest(request.url)) {
						print.warning();
					}
				},
			});
			await network.enable();
			await use(network);
			await network.disable();
		},
		{ auto: true },
	],
});

export { expect };