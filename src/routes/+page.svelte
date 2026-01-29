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

	// fetch that data
	let limit = import.meta.env.VITE_TOURN_LIMIT || 256;
	const tournData = indexFetch('/public/invite/upcoming', { queries: {limit}});

	const columns = [{
		id     : 'id',
		width  : 50,
		hidden : true,
	},{
		id       : 'week',
		header   : 'Week',
		flexgrow : 0,
		hidden   : true,
		template : (value  : string, row) => {
			return `${row.year}-${row.week}`;
		},
	},{
		id          : 'dates',
		header      : 'Dates',
		flexgrow    : 0,
		width       : 84,
		cell        : DateRange,
		columnClass : 'p-0 text-center',
		tooltip     : (row) => {
			const rangeOutput = showDateRange({
				dtStartISO : row.start,
				dtEndISO   : row.end,
				format     : 'long',
				mode       : 'full',
			});
			return rangeOutput.fullOutput;
		},
		sort : (a, b) => a.sortnumeric - b.sortnumeric,
	},{
		id           : 'name',
		header       : 'Tournament',
		flexgrow     : 2,
		cell         : TournLink,
		tooltip      : row => `${row.name} ${row.weekendName || ''}: https://${import.meta.env.VITE_WEB_URL}/invite/${row.webname}`,
		linkFunction : row => `/invite/${row.webname}`,
	},{
		id      : 'location',
		header  : 'City/Platform',
	},{
		id          : 'state',
		width       : 64,
		header      : 'Location',
		flexgrow    : 0,
		columnClass : 'text-center',
		tooltip     : row => `Timezone: ${ row.tz }`,
		template    : (value:string, row) => {
			if (row.state) {
				return row.state;
			}
			if (row.tz) {
				return shortZone(row.tz);
			}
			return 'UTC';
		},
	},{
		id          : 'mode',
		header      : 'Mode',
		width       : 56,
		flexgrow    : 0,
		cell        : Mode,
		columnClass : 'p-0',
		sort        : false,
	},{
		id          : 'eventTypes',
		header      : 'Event Types',
		width       : 128,
		flexgrow    : 0,
		columnClass : 'flexwrap text-center',
		sort        : false,
		tooltip     : (row) => {
			return row.eventTypes
			.replace('speech', 'IE')
			.replace('debate', 'Debate')
			.replace('congress', 'Congress')
			.replace('wsdc', 'Worlds')
			.replace('wudc', 'British Parli')
			.replace('mock_trial', 'Mock Trial')
			.replace('attendee', '')
			.replace(/^\s+|\s+$/g, '')
			.replace(/^\,|\,$/g, '');
		},
		template    : (value:string, row) => {
			return row.eventTypes
				.replace('speech', 'IE')
				.replace('debate', 'DB')
				.replace('congress', 'CON')
				.replace('wsdc', 'WS')
				.replace('wudc', 'BP')
				.replace('mock_trial', 'MT')
				.replace('attendee', '')
				.replace(/^\s+|\s+$/g, '')
				.replace(/^\,|\,$/g, '');

		},
	},{
		id     : 'events',
		header : 'Events Offered',
		filter : true,
		hidden : true,
	},{
		id       : 'signup',
		header   : 'Judge',
		filter   : true,
		width    : 64,
		flexgrow : 0,
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
