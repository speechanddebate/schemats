<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Ballot from './Ballot.svelte';

	const { Story } = defineMeta({
		component: Ballot,
		parameters: {
			layout: 'padded',
		},
	});

	function debateBallot() {
		return {
			flight: 2,
			JudgeId: 1,
			RoomId: 1,
			roomName: 'Room 101',
			start: new Date().toISOString(),
			status: 'not_started',
			ballotText: 'Please hit start right away so blah blah blah you know',
			Tourn: {
				tz: 'America/Chicago',
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