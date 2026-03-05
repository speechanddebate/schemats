<script lang="ts">

	// svelte
	import Loading from '$lib/layouts/Loading.svelte';
	import SVGrid from '$lib/grid/SVGrid.svelte';
	import TournLink from '$lib/invite/TournLink.svelte';
	import Mode from '$lib/invite/Mode.svelte';
	import { type SchematColumn } from '$lib/grid/SVGrid.svelte';
	import DateRange from '$lib/invite/DateRange.svelte';

	// not svelte
	import { indexFetch } from '$lib/indexfetch';
	import { showDateRange } from '$lib/helpers/dt';
	import { shortZone } from '$lib/helpers/dt';

	import type { TournData } from '$lib/invite/invite';
	import type { GridOptions } from '$lib/grid/svgrid.js';
    import Registration from '$lib/invite/Registration.svelte';

	// fetch that data
	let limit = 256; // import.meta.env.VITE_TOURN_LIMIT || 256;
	let { data } = $props();

	const tournData = indexFetch('/pages/invite/upcoming', { queries: {limit}});

	const columns = $derived.by( () => {

		let NSDACategories = data.NSDACategories;

		return [
			{
				id     : 'id',
				width  : 50,
				hidden : true,
				filter : false,
			},{
				id            : 'districts',
				header        : 'District Tournament',
				width         : 50,
				hidden        : true,
				filter        : true,
				filterSort    : 8,
				filterOptions : ['Yes', 'No'],
			},{
				id       : 'week',
				header   : 'Week',
				flexgrow : 0,
				hidden   : true,
				filter   : false,
				template : (value  : string, row : TournData) => {
					return `${row.year}-${row.week}`;
				},
			},{
				id          : 'dates',
				header      : 'Dates',
				flexgrow    : 0,
				width       : 84,
				cell        : DateRange,
				filter      : false,
				columnClass : 'p-0 text-center',
				tooltip     : (row:TournData) => {
					const rangeOutput = showDateRange({
						startISO : row.start,
						endISO   : row.end,
						format   : 'long',
						mode     : 'full',
					});
					return rangeOutput.fullOutput;
				},
				sort : (a:TournData, b:TournData) => a.sortnumeric - b.sortnumeric,
			},{
				id           : 'fullDates',
				header       : 'Full Dates',
				filterHeader : 'Dates',
				filterSort   : 6,
				flexgrow     : 3,
				width        : 84,
				hidden       : 1,
				sort : (a:TournData, b:TournData) => a.sortnumeric - b.sortnumeric,
			},{
				id           : 'name',
				header       : 'Tournament',
				filterHeader : 'Name',
				filterSort   : 1,
				flexgrow     : 2,
				cell         : TournLink,
				tooltip      : (row:TournData) => {
					return `${row.name} ${row.weekendName || ''}: https://${import.meta.env.VITE_WEB_URL}/invite/${row.webname}`;
				},
				linkFunction : (row : TournData) => `/invite/${row.webname}`,
			},{
				id      : 'location',
				header  : 'City/Platform',
			},{
				id          : 'state',
				width       : 64,
				header      : 'LO/TZ',
				filterHeader: 'State/Timezone',
				filterSort  : 2,
				flexgrow    : 0,
				columnClass : 'text-center',
				tooltip     : (row:TournData) => `Timezone: ${ row.tz }`,
				template    : (value:string, row:TournData) => {
					console.log(`tz is ${row.tz}`);
					if (row.inPerson > 0 && row.state || row.country) {
						return row.state || row.country;
					}
					if (row.tz) {
						return shortZone(row.tz);
					}
					return 'UTC';
				},
			},{
				id       : 'country',
				width    : 48,
				header   : 'Country',
				filter   : false,
				flexgrow : 0,
				hidden   : true,
			},{
				id       : 'tz',
				width    : 48,
				header   : 'Full Time Zone',
				filter   : false,
				flexgrow : 0,
				hidden   : true,
			},{
				id            : 'modes',
				width         : 48,
				header        : 'Modes',
				flexgrow      : 0,
				filterOptions : ['In Person ', 'Hybrid ', 'Online '],
				hidden        : true,
			},{
				id          : 'mode',
				header      : 'Mode',
				width       : 50,
				flexgrow    : 0,
				cell        : Mode,
				columnClass : 'p-0 smallHeader',
				filter      : false,
				sort        : false,
				template    : (value:string, row:TournData) => {
					let resultString = '';
					if (row.inPerson > 0) resultString += 'In Person ';
					if (row.online > 0) resultString += 'Online ';
					if (row.hybrid > 0) resultString += 'Hybrid ';
					return resultString;
				},
			},{
				id          : 'registration',
				header      : 'Registration',
				width       : 156,
				flexgrow    : 0,
				cell        : Registration,
				filter: false,
			},{
				id       : 'schoolCount',
				header   : 'Schools Registered',
				width    : 64,
				flexgrow : 0,
				filter   : false,
				hidden   : true,
			},{
				id            : 'eventTypes',
				header        : 'Event Categories',
				filterSort    : 3,
				width         : 64,
				columnClass   : 'flexwrap text-center text-[9px]',
				filterOptions : ['Speech', 'Debate', 'Congress', 'Worlds', 'Mock Trial', 'BP'],
				sort          : false,
				tooltip : (row:TournData) => {
					return row.eventTypes
					.replace('Speech', 'IE')
					.replace('WUDC', 'British Parli')
					.replace('Mock Trial', 'Mock Trial')
					.replace('attendee', '')
					.replace(/^\s+|\s+$/g, '')
					.replace(/^,|,$/g, '');
				},
				template    : (value:string, row:TournData) => {
					return row.eventTypes
						.replace('Speech', 'IE')
						.replace('Debate', 'DB')
						.replace('Congress', 'CON')
						.replace('Worlds', 'WS')
						.replace('Mock Trial', 'MT')
						.replace('attendee', '')
						.replace(/^\s+|\s+$/g, '')
						.replace(/^,|,$/g, '');

				},
			},{
				id           : 'events',
				header       : 'Events',
				filterHeader : `Event Names`,
				filterSort   : 4,
				hidden       : true,
			},{
				id            : 'nsdaCategories',
				header        : 'Event Types',
				filterSort    : 5,
				hidden        : true,
				filterOptions : NSDACategories,
			},{
				id          : 'signup',
				header      : 'Judge',
				width       : 64,
				flexgrow    : 0,
				columnClass : 'text-center',
			},
		];
	});

	const options:GridOptions = {
		title      : 'Upcoming Tournaments',
		bigTitle   : true,
		reorder    : true,
	};

	// why this is a function and just not a string in the column definition, I
	// do not know

	options.columnStyle = (col:SchematColumn) => {
		if (col.columnClass) {
			return col.columnClass;
		}
	};

</script>

<div class="w-full">
	{#if tournData.status !== 'success'
		|| tournData.isFetching
	}
		<Loading tanstackJob={tournData} />
	{:else}
		<div class='px-3 overflow-x-scroll py-3 bg-back'>
			<SVGrid
				columns = { columns }
				data    = { tournData.data }
				options = { options }
			/>
		</div>
	{/if}
</div>
