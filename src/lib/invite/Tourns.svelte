<script lang="ts">
	import Table from '$lib/Table.svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { inviteApi } from '$lib/invite/api';
	import type { Tournament } from '$lib/types/invite.js';

	const limit = 2000;

	const tourns = createQuery<Tournament[], Error>({
		queryKey: ['tourns', limit],
		queryFn: () => inviteApi().getTournaments(limit),
	});

	const dateDisplay = (params) => {
		return new Date(params.value);
	};

	const columnDefs = [
		{
			field        : 'id',
			hide         : true,
			cellDataType : 'number',
		},
		{
			field : 'name',
		},
		{
			field  : 'location',
			filter : true,
		},
		{
			headerName : 'Timezone',
			field      : 'tz',
		},
		{
			field: 'state',
		},
		{
			field: 'country',
		},
		{
			field          : 'start',
			headerName     : 'Tournament Starts',
			valueFormatter : (params) => new Date(params.value),

		},
		{
			field          : 'end',
			headerName     : 'Tournament Ends',
			valueFormatter : (params) => new Date(params.value),
		},
		{
			field: 'mode',
		},
	];

</script>

<div>
	{#if $tourns.status === 'pending'}
		<span>Loading...</span>
	{:else if $tourns.status === 'error'}
		<span>Error: {$tourns.error.message}</span>
	{:else}
		<Table
			data    = {$tourns.data}
			header  = 'Upcoming Tournaments'
			options = { { columnDefs } }
		/>

		{#if $tourns.isFetching}
			<div style="color:darkgreen; font-weight:700">Background Updating...</div>
		{/if}
	{/if}
</div>
