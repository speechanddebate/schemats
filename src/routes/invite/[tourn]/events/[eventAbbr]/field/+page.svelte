<script lang='ts'>

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky.

	import { indexFetch } from '$lib/indexfetch';
	import { getContext } from 'svelte';
	import Loading from '$lib/layouts/Loading.svelte';
	import { resolve } from '$app/paths';

	import Sidebar from '$lib/layouts/Sidebar.svelte';
	import { page } from '$app/state';
	import type {Webname} from '../../../inviteTypes';

	const webname:Webname = getContext('webname');

	// Queries must be in a derived when they originate from page param slugs.
	// Learning this information cost me a nonzero portion of my soul. -CLP

	let fieldReports = $derived(indexFetch(
		`/public/invite/${webname.tournId}/events/`,
		{ key: `${page.params.eventAbbr}/field`}
	));

	const pageContent = indexFetch(
		`/public/invite/${webname.tournId}`,
	);

	import AgGrid from '$lib/grid/AgGrid.svelte';
	import { type gridThemeOptions } from '$lib/grid/index';
	import { type ColDef, type GridOptions } from 'ag-grid-community';

	const columnDefs:ColDef[] = [
		{
			field        : 'id',
			hide         : true,
			cellDataType : 'number',
		},
		{
			field        : 'code',
			headerName   : 'Code',
			filter       : true,
		},
		{
			field        : 'name',
			headerName   : 'Name',
			filter       : true,
		},
		{
			field        : 'schoolId',
			headerName   : 'School ID',
			filter       : true,
			hide         : true,
		},
		{
			field        : 'schoolName',
			headerName   : 'School',
			filter       : true,
		},
		{
			field      : 'waitlist',
			headerName : 'Waitlist',
			filter     : true,
			valueGetter : (entry) => {
				if (entry.waitlist) {
					return 'Y';
				}
			},
		},
	];

	const options:GridOptions = {
		columnDefs,
		paginationPageSize : 512,
	};

	const themeOptions:gridThemeOptions = $derived({
		smallHeader        : `Entry Field in ${page.params.eventAbbr}`,
		fileName           : `${ webname.webname }-entries-${page.params.eventAbbr }.csv`,
	});

</script>

		<Loading tanstackJob={fieldReports}>
		</Loading>

		{#if fieldReports.status === 'success'}

			<div class='main py-0'>
				<AgGrid
					data         = { fieldReports.data }
					options      = { options }
					themeOptions = { themeOptions }
				/>
			</div>

			<Sidebar>
				<div class="sidenote min-h-[50dvh]">

					<a
						class = '
						  text-black
							blue full bg-back-100 text-xs
							border-s-2 border-primary-800
							border-y-1 border-y-back-300
							hover:bg-secondary-100
							mb-4
							'
						href  = {resolve(`/invite/${webname.webname}/events`, {})}
					>Return to Events</a>

					{#each pageContent.data?.events as event (event.id) }
						{#if event.fieldReport}
							<a
								class = '
									text-black
									blue full bg-back-100 text-xs
									border-s-2 border-primary-800
									border-y-1 border-y-back-300
									hover:bg-secondary-100
									'
								href  = {resolve(`/invite/${webname.webname}/events/${event.abbr}/field`, {})}
							>{event.abbr} Field Report</a>
						{/if}
					{/each}

				</div>
			</Sidebar>
		{/if}