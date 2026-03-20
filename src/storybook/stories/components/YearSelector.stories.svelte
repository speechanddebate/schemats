<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import YearSelector from '../../../lib/components/YearSelector.svelte';

	const { Story } = defineMeta({
		component: YearSelector,
	});
</script>

	<Story
	name="Default"
	args = {{
		startDate: new Date(2022, 0, 1),
		endDate: new Date(2023, 0, 1),
	}}
	/>
