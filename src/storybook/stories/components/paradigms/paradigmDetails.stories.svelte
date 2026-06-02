<script lang="ts" module>
	import { faker } from '@faker-js/faker';
	import type { ParadigmDetails as ParadigmDetailsData } from '$indexcards/schemas';
	import { getRestParadigmResponseMock } from '$indexcards/index.msw';
	import { fakeParadigmCertBadge } from '../../../utils/fakerUtils';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ParadigmDetails from '../../../../routes/paradigms/[id]/paradigmDetails.svelte';
	import { fn } from 'storybook/test';

	const generateFakeData = (): ParadigmDetailsData => ({
		...getRestParadigmResponseMock(),
		name: faker.person.fullName(),
		paradigm: `<p>${faker.lorem.paragraphs(10)}</p>`,
		certifications: Array.from({ length: faker.number.int({ min: 0, max: 6 }) }, () => ({
			id: faker.number.int(),
			label: faker.lorem.words(2),
			tag: faker.lorem.word(),
			description: faker.lorem.sentence(),
			sitewide: true,
			hidden: false,
			approval: true,
			show_answers: false,
			admin_only: false,
			circuit:null,
			Badge: fakeParadigmCertBadge(),
			PersonQuizzes: [{
				id: faker.number.int(),
				person: faker.number.int(),
				quiz: faker.number.int(),
				pending: false,
				approvedBy: null,
				updatedAt: faker.helpers.maybe(() => faker.date.past().toISOString(), { probability: 0.75 }) ?? '',
			}],
		})),
	});

	const { Story } = defineMeta({
		component: ParadigmDetails,
		args: {
			data: generateFakeData(),
			isLoading: false,
			displayBack: true,
			backFunction: fn(),
		},
	});
</script>

<Story
	name="Default"
/>

<Story
	name="Loading"
	args={{
		data: null,
		isLoading: true,
	}}
/>

<Story
	name="No Data"
	args={{
		data: null,
	}}
/>