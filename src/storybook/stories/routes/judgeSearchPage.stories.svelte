<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { expect, within } from 'storybook/test';
	import { HttpResponse, http } from 'msw';
	import type { UnlinkedJudge } from '$indexcards/schemas/unlinkedJudge';
	import { getRestJudgesUnlinkedSearchMockHandler } from '$indexcards/index.msw';
	import JudgeSearchPage from '../../../routes/user/judge/search/+page.svelte';
	import { faker } from '@faker-js/faker';

	const { first, last } = {
		first: faker.person.firstName(),
		last: faker.person.lastName(),
	};
	const sampleRows: UnlinkedJudge[] = [
		{
			id: 101,
			type: 'judge',
			first: first,
			last: last,
			schoolName: 'Northview High',
			tournName: 'Bluegrass Invitational',
			tournCount: 1,
		},
		{
			id: 202,
			type: 'chapter_judge',
			first: first,
			last: last,
			schoolName: 'Central Debate Academy',
			tournName: null,
			tournCount: 4,
		},
		{
			id: 303,
			type: 'judge',
			first: first,
			last: last,
			schoolName: undefined,
			tournName: 'Heartland Classic',
			tournCount: undefined,
		},
	];

	const linkRequestsHandler = (response: unknown[]) =>
		http.get('*/user/judges/linkRequests', () => {
			return HttpResponse.json(response, { status: 200 });
		});

	const { Story } = defineMeta({
		title: 'Routes/User/Judge/Search',
		component: JudgeSearchPage,
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
				getRestJudgesUnlinkedSearchMockHandler([]),
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
				getRestJudgesUnlinkedSearchMockHandler(sampleRows),
				linkRequestsHandler([
					{ id: 101, type: 'judge' },
					{ id: 202, type: 'chapter_judge' },
				]),
			],
		},
	}}
	play={async ({ canvasElement, step }) => {
		const canvas = within(canvasElement);

		await step('renders requested and available rows', async () => {
			const requestedMessages = await canvas.findAllByText(
				'Request made, awaiting coach/tournament approval.',
			);
			await expect(requestedMessages.length).toBe(2);
			await expect(await canvas.findByRole('button', { name: 'Request Link' })).toBeInTheDocument();
		});
	}}
/>
