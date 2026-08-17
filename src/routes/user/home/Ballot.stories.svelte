<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { faker } from '@faker-js/faker';
	import Ballot from './Ballot.svelte';

	const { Story } = defineMeta({
		component: Ballot,
		parameters: {
			layout: 'padded',
		},
	});

	function debateBallot() {
		return {
			flight: 1,
			Judge: {
				id: 1,
				first: faker.person.firstName(),
				last: faker.person.lastName(),
				code: String(faker.number.int({ min: 1000, max: 9999 })),
			},
			Event: {
				id: 1,
				name: 'JVPF',
				type: 'debate',
				abbr: 'JVPF',
			},
			Round: {
				id: 1,
				name: 1,
				label: null,
				flighted: true,
			},
		};
	}
</script>

<Story name="Default" args={{ ballot: debateBallot() }}>
	{#snippet template(args)}
		<div class="w-full max-w-3xl mx-auto">
			<Ballot {...args} />
		</div>
	{/snippet}
</Story>