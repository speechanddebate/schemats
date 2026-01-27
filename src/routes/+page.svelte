<script lang="ts">

	import { indexFetch } from '$lib/indexfetch';

	import Loading from '$lib/layouts/Loading.svelte';
	import SVGrid from '$lib/grid/SVGrid.svelte';

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
	},{
		id      : 'location',
		header  : 'City/Platform',
	},{
		id       : 'state',
		width    : 64,
		header   : 'LO',
		flexgrow : 0,
	},{
		id     : 'mode',
		header : 'Mode',
		width  : 64,
		flexgrow : 0,
	},{
		id     : 'signup',
		header : 'Judge Signups',
		filter : true,
		width  : 64,
		hidden : true,
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
