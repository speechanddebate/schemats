import type { Preview } from '@storybook/sveltekit';
import { initialize, mswLoader } from 'msw-storybook-addon';
import '../src/app.css';
import QueryClientDecorator from '../src/lib/storybook/Decorators/queryClientDecorator.svelte';
import { getIndexCardsAPIMock } from '../src/indexcards/index.msw';

initialize();

const preview: Preview = {
	loaders: [mswLoader],
	decorators: [
		(Story) => ({
			Component: QueryClientDecorator,
			props: {},
			slots: {
				default: Story,
			},
		}),
	],

	parameters: {
		msw: {
			handlers: getIndexCardsAPIMock(),
		},

		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},

		a11y: {
			test: 'todo',
		},
	},
};

export default preview;