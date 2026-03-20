<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { faker } from '@faker-js/faker';
	import Header from '$lib/layouts/Header.svelte';
	import { expect, fn, userEvent, within } from 'storybook/test';

	const { Story } = defineMeta({
		component: Header,
		args: {
			logoutFn: fn(),
		},
		parameters: {
			session: null,
		},
	});

	</script>

	<Story
	name="Logged Out"
	/>

	<Story
	name="Logged In"
	parameters={{
		session: {
			Person: {
				firstName: faker.person.firstName(),
				lastName: faker.person.lastName(),
				email: faker.internet.email(),
				id: faker.number.int(),
				tz: 'UTC',
			},
		},
	}}
	play={async ({ canvasElement, parameters, args, step }) => {
		const canvas = within(canvasElement);
		const email = parameters.session.Person.email;

		await step('shows logged-in user email in header', async () => {
			await expect(canvas.getAllByText(email).length).toBeGreaterThan(0);
		});
		await step('calls logout function when logout button is clicked', async () => {
			const accountTriggers = canvasElement.querySelectorAll('#profile-button');
			await expect(accountTriggers.length).toBeGreaterThan(0);

			const avatarTrigger = accountTriggers[accountTriggers.length - 1] as HTMLElement;
			await userEvent.click(avatarTrigger);

			const logoutButton = await canvas.findByRole('button', { name: /logout/i });
			await userEvent.click(logoutButton);
			expect(args.logoutFn).toHaveBeenCalled();
		});
	}}
	/>

	<Story
	name="Su'd In"
	parameters={{
		session: {
			Person: {
				firstName: faker.person.firstName(),
				lastName: faker.person.lastName(),
				email: faker.internet.email(),
				id: faker.number.int(),
				tz: 'UTC',
			},
			Su: {
				firstName: faker.person.firstName(),
				lastName: faker.person.lastName(),
				email: faker.internet.email(),
				id: faker.number.int(),
				tz: 'UTC',
			},
		},
	}}
	/>

	<Story
	name="Has notifications"
	args={{
		notificationCount: 3,
	}}
	parameters={{
		session: {
			Person: {
				firstName: faker.person.firstName(),
				lastName: faker.person.lastName(),
				email: faker.internet.email(),
				id: faker.number.int(),
				tz: 'UTC',
			},
		},
	}}
	/>