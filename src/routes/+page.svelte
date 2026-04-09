<script lang="ts">

	// svelte
	import Loading from '$lib/layouts/Loading.svelte';

	import SVGrid from '$lib/layouts/grid/SVGrid.svelte';
	import type { SchematColumn } from '$lib/layouts/grid/svgrid.d.ts';

	import TournLink from '$lib/invite/TournLink.svelte';
	import Mode from '$lib/invite/Mode.svelte';
	import DateRange from '$lib/invite/DateRange.svelte';

	// not svelte
	import config from '$config';
	import { indexFetch } from '$lib/indexfetch';
	import { showDateRange } from '$lib/helpers/dt';
	import { shortZone } from '$lib/helpers/dt';

	import type { GridOptions } from '$lib/layouts/grid/svgrid.js';
    import Registration from '$lib/invite/Registration.svelte';
	import Ads from '$lib/components/ads.svelte';
    import type { IRow } from '@svar-ui/svelte-grid';

	let { data } = $props();

	// fetch that data eventually we'll want the user to be able to change
	// this, probably requiring a callback to whatever pulled the data. So
	// pre-emptively make it state
	let limit = $state(512);

	const tournData = $derived(indexFetch('/pages/invite/upcoming', { queries: {limit}}));

	const columns: SchematColumn[] = $derived.by( () => {

		let NSDACategories = Array.isArray(data.NSDACategories) ? data.NSDACategories : [];

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
				template : (value  : string, row : IRow) => {
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
				tooltip     : (row:IRow) => {
					const rangeOutput = showDateRange({
						startISO : row.start,
						endISO   : row.end,
						format   : 'long',
						mode     : 'full',
					});
					return rangeOutput.fullOutput;
				},
				sort : (a:IRow, b:IRow) => {
					if (a.sortnumeric < b.sortnumeric) return -1;
					if (a.sortnumeric > b.sortnumeric) return 1;
					return 0;
				},
			},{
				id           : 'fullDates',
				header       : 'Full Dates',
				filterHeader : 'Dates',
				filterSort   : 6,
				flexgrow     : 3,
				width        : 84,
				hidden       : true,
				sort : (a:IRow, b:IRow) => {
					if (a.sortnumeric < b.sortnumeric) return -1;
					if (a.sortnumeric > b.sortnumeric) return 1;
					return 0;
				},
			},{
				id           : 'name',
				header       : 'Tournament',
				filterHeader : 'Name',
				filterSort   : 1,
				flexgrow     : 2,
				cell         : TournLink,
				tooltip      : (row:IRow) => {
					return `${row.name} ${row.weekendName || ''}: https://${config.WEB_URL}/invite/${row.webname}`;
				},
				linkFunction : (row : IRow) => `/invite/${row.webname}`,
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
				tooltip     : (row:IRow) => `Timezone: ${ row.tz }`,
				template    : (value:string, row:IRow) => {
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
				template    : (value:string, row:IRow) => {
					let resultString = '';
					if (row.inPerson > 0) resultString += 'In Person ';
					if (row.online > 0) resultString += 'Online ';
					if (row.hybrid > 0) resultString += 'Hybrid ';
					return resultString;
				},
			},{
				id       : 'registration',
				header   : 'Registration',
				width    : 156,
				flexgrow : 0,
				cell     : Registration,
				filter   : false,
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
				tooltip : (row:IRow) => {
					return row.eventTypes
					.replace('Speech', 'IE')
					.replace('WUDC', 'British Parli')
					.replace('Mock Trial', 'Mock Trial')
					.replace('attendee', '')
					.replace(/^\s+|\s+$/g, '')
					.replace(/^,|,$/g, '');
				},
				template    : (value:string, row:IRow) => {
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
				filterOptions : NSDACategories.map((cat) => cat.name),
			},{
				id          : 'signup',
				header      : 'Judge',
				width       : 64,
				flexgrow    : 0,
				columnClass : 'text-center whitespace-nowrap',
			},
		];
	});

	const options:GridOptions = {
		title      : 'Upcoming Tournaments',
		bigTitle   : true,
		tableOptions : {
			reorder    : false,
		},
	};

	// why this is a function and just not a string in the column definition, I
	// do not know

	options.tableOptions.columnStyle = (col:SchematColumn) => {
		if (col.columnClass) {
			return col.columnClass;
		}
	};

</script>

	<!-- begin routes/page.svelte here -->
	<Ads />
	<div class='px-3 overflow-x-scroll py-3 bg-back wg-full'>
		{#if tournData.status !== 'success'
			|| tournData.isFetching
		}
			<Loading tanstackJob={tournData} />
		{:else}
				<SVGrid
					columns = { columns }
					data    = { tournData.data }
					options = { options }
				/>
		{/if}
	</div>