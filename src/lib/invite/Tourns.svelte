<script lang="ts">

	import { indexFetch } from '$lib/indexfetch';

	import Loading from '$lib/layouts/Loading.svelte';
	import SVGrid from '$lib/grid/SVGrid.svelte';

	import type { Tournament } from '$lib/types/invite.js';
	import { showDate, showTime } from '$lib/helpers/dateTime';
	import { ucfirst } from '$lib/helpers/text';

	let limit = import.meta.env.VITE_TOURN_LIMIT || 256;

	const tournData = indexFetch('/public/invite/upcoming', { queries: {limit}});

	const columns = [{
		id     : 'id',
		width  : 50,
		hidden : true,
	},{
		id       : 'name',
		header   : 'Tournament',
		flexgrow : 2,
		resize   : true,
		sort     : true,
	},{
		id      : 'location',
		header  : 'City/Platform',
		tooltip : 'Location of the Tournament or Online Platform',
		resize  : true,
		sort    : true,
	},{
		id     : 'state',
		width  : 64,
		resize: true,
		header: {
			text : 'LO',
			filter: {
				type: "richselect",
			},
		},
		sort    : true,
	},{
		id     : 'mode',
		header : 'Mode',
		width  : 48,
		resize : true,
		sort   : true,
	},{
		id     : 'signup',
		header : 'Judge Signups',
		filter : true,
		width  : 64,
		resize : true,
		sort   : true,
	}];

	const options = {
		reorder: true,

	};

</script>

<div class="w-full">

	{#if tournData.status !== 'success' || tournData.isFetching}
		<Loading tanstackJob={tournData} />
	{:else}
		<div class='px-4 overflow-x-scroll py-5'>
			<SVGrid
				data    = { tournData.data }
				columns = { columns }
				options = { options }
			/>
		</div>
	{/if}
</div>
