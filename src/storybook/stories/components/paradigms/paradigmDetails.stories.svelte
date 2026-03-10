<script lang="ts" module>
	import { faker } from '@faker-js/faker';
	import type { ParadigmDetails as ParadigmDetailsData } from '$indexcards/schemas';
	import { getGetParadigmResponseMock } from '$indexcards/index.msw';
	import { fakeJudgeRecord, fakeParadigmCertBadge } from '../../../utils/fakerUtils';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ParadigmDetails from '$lib/components/paradigms/paradigmDetails.svelte';
	import { fn } from 'storybook/test';

	const generateFakeData = (): ParadigmDetailsData => ({
		...getGetParadigmResponseMock(),
		name: faker.person.fullName(),
		record: faker.helpers.arrayElements(Array.from({ length: 20 }, () => fakeJudgeRecord())),
		paradigm: `<p>${faker.lorem.paragraphs(10)}</p>`,
		certifications: Array.from({ length: faker.number.int({ min: 0, max: 6 }) }, () => ({
			title: faker.lorem.words(3),
			description: faker.lorem.paragraph(),
			updatedAt: faker.helpers.maybe(() => faker.date.past().toISOString(), { probability: 0.75 }),
			badge: fakeParadigmCertBadge(),
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