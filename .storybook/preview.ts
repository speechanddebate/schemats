import type { Preview } from '@storybook/sveltekit';
import { initialize, mswLoader } from 'msw-storybook-addon';
import '../src/app.css';
import QueryClientDecorator from '../src/storybook/decorators/QueryClientDecorator.svelte';
import { getIndexCardsAPIMock } from '../src/indexcards/index.msw';

initialize();

const preview: Preview = {
	loaders: [mswLoader],
	decorators: [
		(Story, { parameters }) => ({
			Component: QueryClientDecorator,
			props: {
				session: parameters?.session ?? null,
			},
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