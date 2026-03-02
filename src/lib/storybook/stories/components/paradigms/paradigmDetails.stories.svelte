<script lang="ts" module>
	import { faker } from '@faker-js/faker';
	import type { GetParadigmByPersonId200 } from '$indexcards/schemas';
	import { getGetParadigmByPersonIdResponseMock } from '$indexcards/index.msw';
	import { fakeParadigmCertBadge } from '../../../../storybook/utils/fakerUtils';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ParadigmDetails from '../../../../components/paradigms/paradigmDetails.svelte';
	import { fn } from 'storybook/test';

	const generateFakeData = (): GetParadigmByPersonId200 => ({
		...getGetParadigmByPersonIdResponseMock(),
		name: faker.person.fullName(),
		paradigm: `<p>${faker.lorem.paragraphs(10)}</p>`,
		record: [{ title: 'Record Item 1', value: 'Value 1' }],
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
