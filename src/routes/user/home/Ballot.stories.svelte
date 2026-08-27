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
			flight: null,
			onlineBallots: true,
			flipStatus: null,
			legion: false,
			label: 'Round 1',
			JudgeId: 1,
			RoundId: 1,
			RoomId: 1,
			roomName: 'Room 101',
			start: new Date().toISOString(),
			status: 'not_started',
			ballotText: 'Please hit start right away so blah blah blah you know',
			TournTz: 'America/Chicago',
			eventType: 'debate',
			onlineMode: null,
			Entries: [
				{
					id: 1,
					side: 'Aff',
					code: 'Test Prep XZ',
				},
				{
					id: 2,
					side: 'Neg',
					code: 'Example High LY',
				},
			],
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
<Story name="PF" args={{ ballot: { ...debateBallot(), flipStatus: 'second',
	eventType: 'debate',
	Entries: [
		{
			id: 1,
			side: null,
			speakerOrder: null,
			code: 'Test Prep XZ',
		},
		{
			id: 2,
			side: null,
			speakerOrder: null,
			code: 'Example High LY',
		},
	],
}}}>
	{#snippet template(args)}
		<div class="w-full max-w-3xl mx-auto">
			<Ballot {...args} />
		</div>
	{/snippet}
</Story>

<Story name="Flighted" args={{ ballot: { ...debateBallot(), flight: 2 } }}>
	{#snippet template(args)}
		<div class="w-full max-w-3xl mx-auto">
			<Ballot {...args} />
		</div>
	{/snippet}
</Story>

<Story name="No Online Ballots" args={{ ballot: { ...debateBallot(), onlineBallots: false } }}>
	{#snippet template(args)}
		<div class="w-full max-w-3xl mx-auto">
			<Ballot {...args} />
		</div>
	{/snippet}
</Story>

<Story name="Mock Trial" args={{ ballot: { ...debateBallot(), label: 'Round 1', roomName: 'Courtroom 1',
	eventType: 'mock_trial' }}}>
	{#snippet template(args)}
		<div class="w-full max-w-3xl mx-auto">
			<Ballot {...args} />
		</div>
	{/snippet}
</Story>

<Story name="Congress" args={{ ballot: { ...debateBallot(), label: 'Session 1', roomName: 'Room 101',
	eventType: 'congress' } }}>
	{#snippet template(args)}
		<div class="w-full max-w-3xl mx-auto">
			<Ballot {...args} />
		</div>
	{/snippet}
</Story>

<Story name="American Legion" args={{ ballot: { ...debateBallot(), legion: true }}}>
	{#snippet template(args)}
		<div class="w-full max-w-3xl mx-auto">
			<Ballot {...args} />
		</div>
	{/snippet}
</Story>

<Story name="WUDC Panelist" args={{ ballot: { ...debateBallot(), chair: false,
	eventType: 'wudc',
	Entries: [
		{
			id: 1,
			side: '1G',
			speakerOrder: null,
			code: 'Test Prep XZ',
		},
		{
			id: 2,
			side: '1O',
			speakerOrder: null,
			code: 'Example High LY',
		},
		{
			id: 3,
			side: '2G',
			speakerOrder: null,
			code: 'Fake Academy PS',
		},
		{
			id: 4,
			side: '2O',
			speakerOrder: null,
			code: 'Not Real WQ',
		},
	],
} }}>
	{#snippet template(args)}
		<div class="w-full max-w-3xl mx-auto">
			<Ballot {...args} />
		</div>
	{/snippet}
</Story>

<Story name="Speech" args={{ ballot: { ...debateBallot(), chair: false,
	eventType: 'speech',
	Entries: [
		{
			id: 1,
			side: null,
			speakerOrder: 1,
			code: 'Test Prep XZ',
		},
		{
			id: 2,
			side: null,
			speakerOrder: 2,
			code: 'Example High LY',
		},
		{
			id: 3,
			side: null,
			speakerOrder: 3,
			code: 'Fake Academy PS',
		},
		{
			id: 4,
			side: null,
			speakerOrder: 4,
			code: 'Not Real WQ',
		},
		{
			id: 5,
			side: null,
			speakerOrder: 5,
			code: 'Fake Academy PS',
		},
		{
			id: 6,
			side: null,
			speakerOrder: 6,
			code: 'Not Real WQ',
		},
	],
} }}>
	{#snippet template(args)}
		<div class="w-full max-w-3xl mx-auto">
			<Ballot {...args} />
		</div>
	{/snippet}
</Story>