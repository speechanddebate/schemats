<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, within } from 'storybook/test';
	import { HttpResponse, http } from 'msw';
	import type { UnlinkedStudentSearch } from '$indexcards/schemas/index';
	import { getRestStudentsUnlinkedSearchMockHandler } from '$indexcards/index.msw';
	import StudentSearchPage from '../../../../routes/user/student/search/+page.svelte';
	import { faker } from '@faker-js/faker';

	const { first, last } = {
		first: faker.person.firstName(),
		last: faker.person.lastName(),
	};
	const sampleRows: UnlinkedStudentSearch[] = [
		{
			id: 101,
			first: first,
			last: last,
			Chapter: {
				name: 'Northview High',
				state: 'KS',
			},
			tournCount: 1,
		},
		{
			id: 202,
			first: first,
			last: last,
			Chapter: {
				name: 'Central Debate Academy',
				state: 'MO',
			},
			tournCount: 4,
		},
		{
			id: 303,
			first: first,
			last: last,
			Chapter: null,
			tournCount: null,
		},
	];

	const linkRequestsHandler = (response: unknown[]) =>
		http.get('*/user/students/linkRequests', () => {
			return HttpResponse.json(response, { status: 200 });
		});

	const { Story } = defineMeta({
		title: 'Routes/User/Student/Search',
		component: StudentSearchPage,
		parameters: {
			layout: 'fullscreen',
			session: {
				Person: {
					id: 999_001,
					first: first,
					last: last,
					email: faker.internet.email(),
					tz: 'UTC',
				},
			},
		},
	});
</script>

<Story
	name="No Results"
	parameters={{
		msw: {
			handlers: [
				getRestStudentsUnlinkedSearchMockHandler([]),
				linkRequestsHandler([]),
			],
		},
	}}
/>

<Story
	name="Mixed Request States"
	parameters={{
		msw: {
			handlers: [
				getRestStudentsUnlinkedSearchMockHandler(sampleRows),
				linkRequestsHandler([
					{ id: 101 },
					{ id: 202 },
				]),
			],
		},
	}}
	play={async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('renders requested and available rows', async () => {
			const requestedMessages = await canvas.findAllByText(
				'Request made, awaiting coach approval.',
			);
			await expect(requestedMessages.length).toBe(2);
			await expect(await canvas.findByRole('button', { name: 'Request Link' })).toBeInTheDocument();
		});
	}}
/>
