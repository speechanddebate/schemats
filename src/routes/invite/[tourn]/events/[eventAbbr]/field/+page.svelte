<script lang='ts'>

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky.

	import { indexFetch } from '$lib/indexfetch';
	import { getContext } from 'svelte';

	import Loading from '$lib/layouts/Loading.svelte';
	import Sidebar from '$lib/layouts/Sidebar.svelte';
	import type { GridOptions } from '$lib/grid/svgrid';
	import SVGrid from '$lib/grid/SVGrid.svelte';

	import { resolve } from '$app/paths';

	import { page } from '$app/state';
	import type {Webname, EventData} from '../../../inviteTypes';

	const webname:Webname = getContext('webname');
	const eventData:EventData = getContext('eventData');

	// Queries must be in a derived block when they originate from page param
	// slugs. Learning this information cost me a nonzero portion of my soul.
	// -CLP

	let fieldReports = $derived(indexFetch(
		`/rest/tourns/${webname.tournId}/events/${page.params.eventAbbr}/field`
	));

	const pageContent = indexFetch(`/rest/tourns/${webname.tournId}/invite`);

	const columns = $derived.by( () => {
		return [
			{
				id     : 'id',
				header : 'ID',
				hidden : true,
				filter : false,
			},{
				id       : 'code',
				header   : 'Code',
				width    : 64,
				flexgrow : 1,
			},{
				id       : 'name',
				header   : 'Name',
				flexgrow : 2,
				width    : 128,
			},{
				id     : 'schoolId',
				header : 'School ID',
				filter : false,
				hidden : true,
			},{
				id     : 'schoolName',
				header : 'School',
				flexgrow : 3,
				width    : 128,
			},{
				id            : 'waitlist',
				header        : 'Waitlist',
				width         : 32,
				filterSort    : 1,
				filterOptions : ['Yes', 'No'],
				template      : (value:string, row) => {
					return row.waitlist ? 'Yes' : 'No';
				},
			},
		]
	});

	const options:GridOptions = $derived.by( () => {
		return {
			title    : `Entry Field : ${ eventData.name }`,
			reorder  : true,
			noFilter : true,
		};
	});

</script>

	<Loading tanstackJob={fieldReports} />

	{#if fieldReports.status === 'success'}

		<div class='main'>
			<div class='w-full px-0 overflow-x-scroll py-0'>
				<SVGrid
					{ columns }
					data = { fieldReports.data.entries }
					{ options }
				/>
			</div>
		</div>

		<Sidebar>
			<div class="sidenote min-h-[50dvh]">

				<a
					class = '
						blue full bg-back-100 text-xs
						text-black
						border-s-2 border-primary-800
						border-y-1 border-y-back-300
						hover:bg-secondary-100
						mb-4
					'
					href  = {resolve(`/invite/${webname.webname}/events`, {})}
				>Return to Events</a>

				{#each pageContent.data?.events as otherEvent (otherEvent.id) }
					{#if otherEvent.fieldReport}
						<a
							class = '
								text-black
								blue full text-xs
								border-s-2 border-primary-800
								border-y-1 border-y-back-300
								hover:bg-secondary-100
								{ page.url.pathname.includes(`/${otherEvent.abbr}/field`)
									? 'bg-primary-700 text-secondary-200 hover:text-black hover:bg-secondary-300'
									: 'bg-back-100 text-black'
								}
								'
							href  = {resolve(`/invite/${webname.webname}/events/${otherEvent.abbr}/field`, {})}
						>{otherEvent.abbr} Field Report</a>
					{/if}
				{/each}

			</div>
		</Sidebar>
	{/if}