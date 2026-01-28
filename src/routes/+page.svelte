<script lang="ts">

	import { indexFetch } from '$lib/indexfetch';
	import Loading from '$lib/layouts/Loading.svelte';
	import SVGrid from '$lib/grid/SVGrid.svelte';
	import TournLink from '$lib/invite/TournLink.svelte';
	import Mode from '$lib/invite/Mode.svelte';

	let limit = import.meta.env.VITE_TOURN_LIMIT || 256;

	const tournData = indexFetch('/public/invite/upcoming', { queries: {limit}});

	const columns = [{
		id     : 'id',
		width  : 50,
		hidden : true,
	},{
		id           : 'name',
		header       : 'Tournament',
		flexgrow     : 2,
		cell         : TournLink,
		linkFunction : (row) => {
			return `/invite/${row.webname}`;
		},
	},{
		id      : 'location',
		header  : 'City/Platform',
	},{
		id       : 'state',
		width    : 64,
		header   : 'Location',
		flexgrow : 0,
	},{
		id          : 'mode',
		header      : 'Mode',
		width       : 72,
		flexgrow    : 0,
		cell        : Mode,
		columnStyle : 'p0',
	},{
		id       : 'eventTypes',
		header   : 'Event Types',
		width    : 128,
		flexgrow : 0,
	},{
		id     : 'events',
		header : 'Events Offered',
		filter : true,
		hidden : true,
	},{
		id       : 'signup',
		header   : 'Judge Signups',
		filter   : true,
		width    : 64,
		flexgrow : 0,
	}];

	const options = {
		title    : 'Upcoming Tournaments',
		bigTitle : true,
		reorder  : true,
	};

</script>

<div class="w-full">
	{#if tournData.status !== 'success' || tournData.isFetching}
		<Loading tanstackJob={tournData} />
	{:else}
		<div class='px-3 overflow-x-scroll py-3'>
			<SVGrid
				columns = { columns }
				data    = { tournData.data }
				options = { options }
			/>
		</div>
	{/if}
</div>
