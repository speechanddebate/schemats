<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, userEvent, within } from 'storybook/test';
	import Sidebar from '$lib/layouts/Sidebar.svelte';

	const { Story } = defineMeta({
	});
</script>

<Story
	name="Sidebar"
	play={async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);
		const toggle = canvas.getByRole('button', { name: /toggle sidebar visibility/i });

		await step('starts open: button shows → and sidebar content is in the DOM', async () => {
			await expect(toggle).toHaveTextContent('→');
			await expect(canvas.getByText('Sidebar Links')).toBeInTheDocument();
		});

		await step('closes on first click: button shows ← and sidebar content is removed', async () => {
			await userEvent.click(toggle);
			await expect(toggle).toHaveTextContent('←');
			await expect(canvas.queryByText('Sidebar Links')).not.toBeInTheDocument();
		});

		await step('reopens on second click: button shows → and sidebar content is back', async () => {
			await userEvent.click(toggle);
			await expect(toggle).toHaveTextContent('→');
			await expect(canvas.getByText('Sidebar Links')).toBeInTheDocument();
		});
	}}
>

<div class="flex w-full flex-row h-screen">
	<div class="main">
		<h5 class="border-b border-primary-500 mb-4">Main Content</h5>
		<p>
			This area represents the page body. Resize the Storybook viewport to check how
			the main section and sidebar sit together.
		</p>
		<p>
			The sidebar should remain visually distinct while the main content keeps most
			of the horizontal space.
		</p>
	</div>

	<Sidebar>
		<div class="sidenote">
			<h5 class="my-0 border-b border-secondary-500 pb-0 leading-8 mb-2">
				Sidebar Links
			</h5>
			<p class="mb-2">Secondary navigation and metadata live here.</p>
			<p>
				<a class="full blue" href="/" on:click|preventDefault>Main</a>
				<a class="full blue" href="/" on:click|preventDefault>Events</a>
				<a class="full blue" href="/" on:click|preventDefault>Rounds</a>
			</p>
		</div>
	</Sidebar>
</div>
</Story>