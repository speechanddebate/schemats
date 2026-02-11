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
    import Registration from '$lib/invite/Registration.svelte';

	// fetch that data
	let limit = import.meta.env.VITE_TOURN_LIMIT || 256;

	const tournData = indexFetch('/pages/invite/upcoming', { queries: {limit}});

	const columns = [{
		id     : 'id',
		width  : 50,
		hidden : true,
		filter : false,
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
		id           : 'fulldates',
		header       : 'Full Dates',
		filterHeader : 'Dates',
		filterSort   : 3,
		flexgrow     : 3,
		width        : 84,
		template     : (value:string, row:TournData) => {
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
			if (row.in_person > 0 && row.state || row.country) {
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
		id          : 'mode',
		header      : 'Mode',
		width       : 50,
		flexgrow    : 0,
		cell        : Mode,
		columnClass : 'p-0 smallHeader',
		sort        : false,
		template    : (value:string, row:TournData) => {
			let resultString = '';

			if (row.in_person > 0) resultString += 'In Person ';
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
		id          : 'eventTypes',
		header      : 'Event Types',
		filterSort : 3,
		width       : 96,
		flexgrow    : 0,
		columnClass : 'flexwrap text-center text-[9px]',
		sort        : false,
		tooltip     : (row:TournData) => {
			return row.eventTypes
			.replace('speech', 'IE')
			.replace('debate', 'Debate')
			.replace('congress', 'Congress')
			.replace('wsdc', 'Worlds')
			.replace('wudc', 'British Parli')
			.replace('mock_trial', 'Mock Trial')
			.replace('attendee', '')
			.replace(/^\s+|\s+$/g, '')
			.replace(/^,|,$/g, '');
		},
		template    : (value:string, row:TournData) => {
			return row.eventTypes
				.replace('speech', 'IE')
				.replace('debate', 'DB')
				.replace('congress', 'CON')
				.replace('wsdc', 'WS')
				.replace('wudc', 'BP')
				.replace('mock_trial', 'MT')
				.replace('attendee', '')
				.replace(/^\s+|\s+$/g, '')
				.replace(/^,|,$/g, '');

		},
	},{
		id         : 'events',
		header     : 'Events Offered',
		filterSort : 4,
		hidden     : true,
	},{
		id          : 'signup',
		header      : 'Judge',
		width       : 64,
		flexgrow    : 0,
		columnClass : 'text-center',
	}];

	interface GridOptions {
		title?      : string,
		bigTitle    : boolean,
		reorder     : boolean,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
		columnStyle? : Function,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
		rowStyle?    : Function,
	};

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
