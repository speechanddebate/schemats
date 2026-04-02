<script lang="ts" module>
	import { faker } from '@faker-js/faker';
	import type {  RestParadigms200Item } from '$indexcards/schemas';
	import { getRestParadigmsResponseMock } from '$indexcards/index.msw';
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import ParadigmListItem from '$lib/components/paradigms/paradigmListItem.svelte';
	import { fn } from 'storybook/test';

	const generateFakeData = (): RestParadigms200Item=> ({
		...getRestParadigmsResponseMock()[0],
		name: faker.person.fullName(),
		tournJudged: faker.number.int({ min: 0, max: 150 }),
	});

	const { Story } = defineMeta({
		component: ParadigmListItem,
		args: {
			item: generateFakeData(),
			onClick: fn(),
		},
	});
</script>

<Story
	name="Default"
/>