
<script lang="ts" module>
import type { PersonTournSummary } from '$indexcards/schemas';
import { SvelteDate } from 'svelte/reactivity';
import { defineMeta } from '@storybook/addon-svelte-csf';
import Tournament from './Tournament.svelte';

const tourn: PersonTournSummary = {
	id: 1,
	name: 'Example Tournament Invitational',
	webname: 'example',
	start: new SvelteDate().toISOString(),
	end: new SvelteDate(new SvelteDate().setDate(new SvelteDate().getDate() + 2)).toISOString(),
	tz: 'America/Chicago',
	roles: [],
	livedoc: {
		url: 'fakeurl',
		caption: 'Live Doc',
	},
	Judge: null,
};
const { Story } = defineMeta({
	component: Tournament,
	parameters: {
		layout: 'padded',
	},
});
</script>

<Story
	name="Tourn | Judge"
	args={{
		tourn: {
			...tourn,
			roles: ['judge'],
			Judge: {
				categoryName: 'JVPF',
				schoolName: 'Example School',
			},
		},
	}}
/>

<Story
	name="Tourn | Student"
	args={{
		tourn: {
			...tourn,
			roles: ['student'],
		},
	}}
/>

<Story
	name="Tourn | Coach"
	args={{
		tourn: {
			...tourn,
			roles: ['coach'],
		},
	}}
/>

<Story
	name="Tourn | Coach and Judge"
	args={{
		tourn: {
			...tourn,
			roles: ['coach', 'judge'],
			Judge: {
				categoryName: 'JVPF',
				schoolName: 'Example School',
			},
		},
	}}
/>

<Story
	name="Tourn | Coach and Student"
	args={{
		tourn: {
			...tourn,
			roles: ['coach', 'student'],
		},
	}}
/>

<Story
	name="Tourn | Student and Judge"
	args={{
		tourn: {
			...tourn,
			roles: ['student', 'judge'],
			Judge: {
				categoryName: 'JVPF',
				schoolName: 'Example School',
			},
		},
	}}
/>