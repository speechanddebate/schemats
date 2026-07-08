import { test as base, expect } from '@playwright/test';
import { defineNetworkFixture } from '@msw/playwright';

type Fixtures = {
	network: ReturnType<typeof defineNetworkFixture>;
};

const BASE_PATH = process.env.INDEXCARDS_BASE_PATH ?? '/v1';

const isApiRequest = (url: string): boolean => {
	return new URL(url).pathname.startsWith(BASE_PATH);
};

export const test = base.extend<Fixtures>({
	network: async ({ context }, use) => {
		const network = defineNetworkFixture({
			context,
			handlers: [],

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
});

export { expect };