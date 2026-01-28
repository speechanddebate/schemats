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
		header   : 'Tournamentz',
		filter   : true,
		flexgrow : 2,
	},{
		id      : 'location',
		header  : 'City/Platform',
	},{
		id       : 'state',
		width    : 64,
		header   : 'LO',
		filter   : true,
		flexgrow : 0,
	},{
		id     : 'mode',
		header : 'Mode',
		width  : 64,
		flexgrow : 0,
	},{
		id     : 'eventTypes',
		header : 'Event Types',
		width  : 64,
	},{
		id     : 'events',
		header : 'Events Offered',
		filter : true,
		hidden : true,
	},{
		id     : 'signup',
		header : 'Judge Signups',
		filter : true,
		hidden : true,
	}];

	const options = {
		title   : 'Upcoming Tournaments',
		reorder : true,
	};

</script>

<div class="w-full">

	{#if tournData.status !== 'success' || tournData.isFetching}
		<Loading tanstackJob={tournData} />
	{:else}
		<div class='px-4 overflow-x-scroll py-5'>
			<SVGrid
				columns = { columns }
				data    = { tournData.data }
				options = { options }
			/>
		</div>
	{/if}
</div>
