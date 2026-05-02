<script lang='ts'>

	// This pattern leads to reactive data display in Svelte 5 & TanStack,
	// which is otherwise tricky.

	import { indexFetch } from '$lib/indexfetch';
	import { getContext } from 'svelte';

	import Loading from '$lib/layouts/Loading.svelte';
	import Sidebar from '$lib/layouts/Sidebar.svelte';

	import SVGrid from '$lib/layouts/grid/SVGrid.svelte';
	import type { GridOptions, SchematColumn } from '$lib/layouts/grid/svgrid';

	import { resolve } from '$app/paths';
	import { ucfirst } from '$lib/helpers/text';

	import { page } from '$app/state';

	import type { Event, Tourn } from '$indexcards/schemas';
    import type { IRow } from '@svar-ui/svelte-grid';
	const tourn:Tourn = getContext('webnameTourn');
	const pageContent = $derived(indexFetch(`/rest/tourns/${tourn.id}/invite`));

	const eventAbbr = $derived(page.params.eventAbbr);
	let fieldReports = $derived(indexFetch(`/rest/tourns/${tourn.id}/events/${eventAbbr}/field`));

	const columns: SchematColumn[] = $derived.by( () => {
		return [
			{
				id     : 'id',
				header : 'ID',
				hidden : true,
				filter : false,
			},{
				id       : 'code',
				header   : 'Code',
				flexgrow : 2,
			},{
				id       : 'name',
				header   : 'Name',
				flexgrow : 3,
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
				template      : (value:string, row:IRow) => {
					return row.School?.name;
				},
			},{
				id            : 'waitlist',
				header        : 'Waitlist',
				flexgrow      : 1,
				filterSort    : 1,
				filterOptions : ['Yes', 'No'],
				template      : (value:string, row:IRow) => {
					return row.waitlist ? 'Yes' : '';
				},
			},
		];
	});

	const options:GridOptions = $derived.by( () => {
		return {
			title    : `Entry Field : ${ fieldReports.data.name }`,
			reorder  : true,
			noFilter : true,
		};
	});

	let events = $derived.by( () => {

		const rawEvents = pageContent.data?.Events.sort( (a:Event, b:Event) => {
			if (a.type !== b.type) return a.type.localeCompare(b.type);
			if (a.nsdaCategoryId
					&& b.nsdaCategoryId
					&& a.nsdaCategoryId !== b.nsdaCategoryId
			) return a.nsdaCategoryId - b.nsdaCategoryId;
			if (a.abbr !== b.abbr) return a.abbr.localeCompare(b.abbr);
			if (a.name !== b.name) return a.name.localeCompare(b.name);
			return a.id - b.id;
		}).filter( (e:Event) => e.settings?.fieldReport );

		const eventsByType = {};

		rawEvents.forEach( (event:Event) => {
			if (!eventsByType[event.type]) eventsByType[event.type] = [];
			eventsByType[event.type].push(event);
		});

		return eventsByType;
	});

	const selectedEvent = $derived.by( () => {
		if (page.url.pathname.includes(`/field`)) {
			return page.params.eventAbbr;
		}
	});

</script>

	<Loading tanstackJob={fieldReports} />

	{#if fieldReports.status === 'success'}

		<div class='main'>
			<div class='w-full px-0 overflow-x-scroll py-0'>
				<SVGrid
					columns = { columns }
					data    = { fieldReports.data.Entries }
					options = { options }
				/>
			</div>
		</div>

		<Sidebar>
			<div class="sidenote min-h-[50dvh]">
				{selectedEvent}

				<a
					class = '
						blue full bg-back-100 text-xs
						text-black
						border-s-2 border-primary-800
						border-y border-y-back-300
						hover:bg-secondary-100
						mb-4
					'
					href  = {resolve(`/invite/${tourn.webname}/events`, {})}
				>Return to Events</a>

				{#each Object.keys(events).sort() as eventType (eventType) }
					<h6>{ucfirst(eventType)}</h6>
					{#each events[eventType] as otherEvent (otherEvent.id) }
						<a
							class = '
								text-black
								blue w-[48%] text-xs
								border-s-2 border-primary-800
								me-[2%]
								border-y border-y-back-300
								hover:bg-secondary-100
								{selectedEvent === otherEvent.abbr
									? 'bg-primary-700 text-secondary-200 hover:text-black hover:bg-secondary-300'
									: 'bg-back-100 text-black'
								}'
							href  = {resolve(`/invite/${tourn.webname}/events/${otherEvent.abbr}/field`, {})}
						>{otherEvent.abbr} Entries</a>
					{/each}
				{/each}

			</div>
		</Sidebar>
	{/if}