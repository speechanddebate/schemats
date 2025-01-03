<script lang="ts">
    import AdCarousel from '$lib/AdCarousel.svelte';
	import DataTable from '$lib/DataTable.svelte';
	// import Sidebar from './Sidebar.svelte';
	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	interface Tourn {
		start    : string,
		end      : string,
		name     : string,
		location : string,
		state    : string,
		webname  : string
	}

    let tournList: Tourn[] = $state();
	tournList = data.tourns;

</script>

<div id="main">
	<AdCarousel />
	<h1 style='text-align: left;'>Upcoming Tournaments</h1>
	<DataTable data={tournList} columns={data.columns} />
</div>

<div id="menu">
	<div class="sidenote">
		<h4 style='text-align: left;'>Actions</h4>
		<!-- <Sidebar /> -->
	</div>
</div>
