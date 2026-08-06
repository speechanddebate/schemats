
<script lang="ts" module>
import { defineMeta } from '@storybook/addon-svelte-csf';
import Tournament from './Tournament.svelte';
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
		roles: ['judge'],
	}}
/>

<Story
	name="Tourn | Student"
	args={{
		roles: ['student'],
	}}
/>

<Story
	name="Tourn | Coach"
	args={{
		roles: ['coach'],
	}}
/>

<Story
	name="Tourn | Coach and Judge"
	args={{
		roles: ['coach', 'judge'],
	}}
/>
