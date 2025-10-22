<script lang="ts">

	import { indexFetch } from '$lib/indexfetch';

	import AgGrid from '$lib/grid/AgGrid.svelte';
	import { type ThemeOptions } from '$lib/grid/AgGrid.svelte';
	import { type ColDef, type GridOptions } from 'ag-grid-community';

	import type { Tournament } from '$lib/types/invite.js';
	import { showDate, showTime } from '$lib/helpers/dateTime';
	import { ucfirst } from '$lib/helpers/text';

	const now = new Date();

	interface RowData {
		data : Tournament,
	};

	let limit = import.meta.env.VITE_TOURN_LIMIT || 256;

	const tournData = indexFetch('/public/invite/upcoming', { queries: {limit}});

	const columnDefs:ColDef[] = [
		{
			field        : 'id',
			hide         : true,
			cellDataType : 'number',
		},
		{
			field     : 'dates',
			cellStyle : { 'textAlign' : 'center'},
			valueGetter : (tourn : RowData) => {
				return tourn.data.dates;
			},
			cellRenderer : (tourn : RowData) => {
				if (tourn.data.year !== now.getFullYear()) {
					return `
						<div class="leading-[16px]">${tourn.data.dates}</div>
						<div class="font-medium leading-[16px]">${tourn.data.year}</div>
					`;
				}
				return tourn.data.dates;
			},
			comparator: (
				valueA : string,
				valueB : string,
				nodeA  : RowData,
				nodeB  : RowData
			) => {
				return nodeA.data.sortnumeric - nodeB.data.sortnumeric;
			},
		},
		{
			field      : 'name',
			headerName : 'Tournament Name',
			width      : 512,
			cellRenderer : (tourn: RowData) => {

				if (tourn.data.districts) {
					const tournName = tourn.data.name.replace(' District Tournament', '');
					return `<div class="flex flex-row flex-wrap">
							<div class="font-medium w-1/2 pr-4 min-w-42">${tournName} District</div>
							<div class="w-1/2 min-w-40">${tourn.data.weekendName}</div>
						</div>
					`;
				}

				return `
					<div class = 'text-pretty'>
						<a href="/invite/${ tourn.data.webname }">
							${tourn.data.name}
						</a>
					</div>
				`;
			},
		},
		{
			field        : 'location',
			headerName   : 'City',
			filter       : true,
			width        : 256,
			cellRenderer : (tourn: RowData) => {
				if (tourn.data.location === 'NSDA Campus') {
					return `
						<a
							href  = "https://campus.speechanddebate.org"
							class = "text-primary-1000 underline decoration-dashed underline-offset-2"
						>NSDA Campus</a>
					`;
				}

				if (tourn.data.location) {
					return ucfirst(tourn.data.location);
				}
			},
		},
		{
			headerName : 'LO',
			width      : 80,
			cellStyle  : { 'textAlign' : 'center' },
			filter     : true,
			valueGetter  : (tourn: RowData) => {
				if (tourn.data.online > 0
					&& tourn.data.in_person === 0
					&& tourn.data.hybrid === 0
				) {
					return tourn.data.tzCode;
				}

				if (tourn.data.country === 'US'
					|| (!tourn.data.country && tourn.data.state)
				) {
					return tourn.data.state;
				}
				return tourn.data.country;
			},
			tooltipValueGetter  : (tourn) => {
				return `Tournament time zone: ${tourn.data.tz}`;
			},
			headerTooltip : 'For in person tournaments, State, Province or Country.  For online, time zone',
		},
		{
			headerName  : 'Mode',
			filter      : true,
			width       : 80,
			tooltipValueGetter : (tourn) => {
				let modes = '';
				['in_person', 'hybrid', 'online'].forEach( (key) => {
					if (tourn.data[key]) {
						let label = key;
						if (label === 'in_person') {
							label = 'In-person';
						} else {
							label = ucfirst(label);
						}
						if (modes) {
							modes += ', ';
						}
						modes += `${tourn.data[key]} ${label} Events`;
					}
				});
				return modes;
			},

			valueGetter : (tourn  : RowData) => {

				let modes = '';

				if (tourn.data.in_person) {
					if (modes) {
						modes += ', ';
					}
					modes += 'In Person';
				}

				if (tourn.data.hybrid) {
					if (modes) {
						modes += ', ';
					}
					modes += 'Hybrid';
				}

				if (tourn.data.online) {
					if (modes) {
						modes += ', ';
					}
					modes += 'Online';
				}
				return modes;
			},
			cellRenderer : (tourn: RowData) => {

				let modeString = `<div class='flex flex-auto flex-row items-center justify-center md:flex-wrap'>`;

				if (tourn.data.in_person) {
					modeString += `
						<span class='lg:w-1/3 inline-block text-center md:w-1/2 sm:w-full'>
							<svg
								class       = 'lg:w-4 lg:h-4 text-success-500 dark:text-success-100 block mx-auto w-3 h-3'
								aria-hidden = 'true'
								xmlns       = 'http://www.w3.org/2000/svg'
								fill="currentColor"
								viewBox     = '0 0 24 24'
							>
								<path
									fill-rule = "evenodd"
									d         = "M8 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2 9a4 4 0 0 0-4 4v1a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-1a4 4 0 0 0-4-4H6Zm7.25-2.095c.478-.86.75-1.85.75-2.905a5.973 5.973 0 0 0-.75-2.906 4 4 0 1 1 0 5.811ZM15.466 20c.34-.588.535-1.271.535-2v-1a5.978 5.978 0 0 0-1.528-4H18a4 4 0 0 1 4 4v1a2 2 0 0 1-2 2h-4.535Z"
									clip-rule = "evenodd"
								/>
							</svg>
						</span>
					`;
				}

				if (tourn.data.online) {
					modeString += `
						<span
							class='lg:w-1/3 inline-block md:w-1/2 sm:w-full'
						>
						<svg
							class       = 'lg:w-4 lg:h-4 text-warning-400 dark:text-warning-200 block mx-auto w-3 h-3'
							aria-hidden = 'true'
							id          = '_x32_'
							xmlns       = 'http://www.w3.org/2000/svg'
							xmlns:xlink = 'http://www.w3.org/1999/xlink'
							viewBox     = '0 0 512 512'
							xml:space   = 'preserve'
							fill        = '#a4490c'
						>
								<path
									stroke       = 'currentColor'
									stroke-width = '2'
									d            = 'M62.957,398.443h392.076c13.193,0,23.985-10.792,23.985-23.978V98.562c0-13.193-10.792-23.977-23.985-23.977 H62.957c-13.207,0-23.985,10.784-23.985,23.977v275.903C38.972,387.651,49.75,398.443,62.957,398.443z M70.147,105.753h377.696 v261.509H70.147V105.753z'
								></path>
								<path
									stroke       = 'currentColor'
									stroke-width = '2'
									d            = 'M0,412.229v5.996c0,10.552,8.631,19.19,19.183,19.19h473.621c10.566,0,19.196-8.638,19.196-19.19v-5.996H0z
								'></path>
								<path
									stroke       = 'currentColor'
									stroke-width = '2'
									d            = 'M266.474,309.785c-1.822,1.484-3.645,2.641-5.495,3.524c-1.243,0.134-2.5,0.233-3.771,0.304v-14.662 c-3.009-2.478-6.06-5.042-9.111-7.684v22.346c-1.257-0.071-2.528-0.169-3.771-0.304c-1.837-0.883-3.659-2.041-5.481-3.524 c-5.933-4.824-11.484-12.967-15.735-23.462h19.379c-3.305-2.946-6.61-5.99-9.915-9.111h-12.656 c-1.512-5.022-2.727-10.439-3.659-16.124c-3.588-3.722-7.091-7.458-10.481-11.188c0.762,9.704,2.33,18.907,4.661,27.312h-23.292 c-6.526-10.537-10.566-22.749-11.328-35.871h22.36c-2.641-3.058-5.212-6.095-7.699-9.118h-14.662 c0.311-5.382,1.2-10.587,2.571-15.608c-3.108-4.224-6.003-8.384-8.687-12.459c-3.983,10.114-6.187,21.111-6.187,32.63 c0,49.227,39.904,89.131,89.145,89.138c11.512,0,22.516-2.218,32.616-6.194c-5.424-3.574-11.018-7.536-16.696-11.837 C267.887,308.563,267.18,309.206,266.474,309.785z M198.221,291.218c-1.568-1.561-3.051-3.2-4.464-4.894h19.634 c1.469,3.997,3.065,7.79,4.873,11.286c2.119,4.104,4.464,7.832,7.035,11.138C215.044,304.849,205.848,298.838,198.221,291.218z'
								></path>
								<path
									stroke       = 'currentColor'
									stroke-width = '2'
									d            = 'M194.45,186.472c1.214-1.413,2.444-2.804,3.771-4.125c7.642-7.635,16.866-13.659,27.134-17.557 c-4.774,6.13-8.786,13.744-11.978,22.445H194.93c1.949,2.973,4.054,6.017,6.286,9.11h9.238c-0.848,3.023-1.554,6.173-2.218,9.386 c2.458,3.143,5,6.321,7.67,9.52c0.96-6.703,2.302-13.073,4.054-18.907h28.138v35.879h-17.318c2.825,3.044,5.693,6.088,8.659,9.118 h8.658v8.666c3.023,2.945,6.074,5.834,9.111,8.652v-17.318h33.689c-0.368,13.087-2.359,25.298-5.552,35.871h-6.666 c4.378,3.524,8.701,6.851,12.938,9.937c0.099-0.283,0.226-0.537,0.325-0.826h19.62c-1.426,1.694-2.909,3.333-4.464,4.894 c-1.328,1.32-2.712,2.571-4.124,3.785c3.743,2.43,7.374,4.64,10.848,6.59c17.219-16.251,27.982-39.268,27.982-64.807 c-0.014-49.234-39.918-89.144-89.145-89.144c-25.553,0-48.562,10.764-64.807,27.968 C189.802,179.098,192.019,182.728,194.45,186.472z M318.173,277.212h-23.321c3.008-10.848,4.83-22.982,5.184-35.871h29.451 C328.724,254.464,324.684,266.675,318.173,277.212z M318.158,196.345c6.526,10.538,10.566,22.756,11.328,35.879h-29.479 c-0.354-12.876-2.119-25.037-5.128-35.879H318.158z M307.098,182.347c1.554,1.561,3.038,3.192,4.45,4.888h-19.62 c-1.469-3.991-3.08-7.79-4.873-11.279c-2.119-4.096-4.478-7.825-7.049-11.138C290.261,168.716,299.456,174.734,307.098,182.347z M257.208,159.944c1.271,0.078,2.528,0.177,3.785,0.311c1.836,0.876,3.659,2.034,5.481,3.517 c5.932,4.824,11.47,12.967,15.735,23.462h-25.002V159.944z M257.208,196.345h28.18c3.192,10.573,5.156,22.806,5.537,35.879h-33.717 V196.345z M238.845,163.772c1.822-1.483,3.644-2.641,5.481-3.517c1.242-0.141,2.5-0.233,3.771-0.311v27.29h-24.945 c1.017-2.486,2.063-4.888,3.207-7.091C230.016,173.038,234.339,167.459,238.845,163.772z'>
								</path>
								<path
									stroke       = 'currentColor'
									stroke-width = '2'
									d            = 'M343.287,281.958c-2.147,4.28-4.577,8.398-7.289,12.303c1.371,2.846,2.528,5.516,3.432,7.973 c1.865,4.98,2.698,9.118,2.684,11.894c0,1.306-0.184,2.302-0.41,2.966c-0.226,0.671-0.466,1.018-0.748,1.307 c-0.283,0.268-0.622,0.508-1.3,0.749c-0.664,0.226-1.652,0.396-2.967,0.396c-2.613,0.014-6.454-0.728-11.074-2.373 c-4.605-1.639-9.987-4.139-15.891-7.423c-20.228-11.244-46.514-31.669-72.434-57.603c-25.92-25.913-46.36-52.2-57.603-72.435 c-3.278-5.904-5.778-11.279-7.416-15.898c-1.653-4.604-2.387-8.44-2.374-11.06c0-1.313,0.17-2.303,0.396-2.967 c0.24-0.67,0.48-1.01,0.748-1.292c0.297-0.289,0.636-0.529,1.314-0.756c0.664-0.226,1.653-0.409,2.966-0.409 c2.768-0.014,6.908,0.819,11.88,2.669c2.472,0.918,5.156,2.077,8.009,3.454c3.913-2.712,8.024-5.142,12.304-7.296 c-5.721-3.143-11.117-5.714-16.103-7.55c-5.819-2.146-11.13-3.411-16.089-3.432c-2.358,0.007-4.661,0.304-6.865,1.046 c-2.204,0.742-4.308,1.97-6.003,3.68c-1.709,1.694-2.938,3.792-3.672,5.989c-0.734,2.204-1.032,4.506-1.045,6.865 c0.014,4.689,1.144,9.669,3.08,15.136c1.935,5.46,4.717,11.378,8.249,17.726c12.092,21.697,33.053,48.535,59.637,75.126 c26.584,26.584,53.422,47.546,75.118,59.637c6.356,3.532,12.275,6.307,17.741,8.25c5.467,1.928,10.439,3.05,15.128,3.072 c2.359,0,4.662-0.297,6.866-1.038c2.189-0.735,4.294-1.964,5.989-3.665c1.709-1.702,2.938-3.807,3.672-6.004 c0.748-2.211,1.045-4.513,1.045-6.865c-0.014-4.965-1.285-10.276-3.432-16.11C348.98,293.046,346.423,287.665,343.287,281.958z'>
								</path>
							</svg>
						</span>
					`;
				}
				if (tourn.data.hybrid) {
					modeString += `
						<span
							class='lg:w-1/3 inline-block md:w-1/2 sm:w-full'
						>
							<svg
								class   = 'lg:w-4 lg:h-4 text-primary-600 dark:text-primary-200 block mx-auto w-3 h-3'
								viewBox = '-4 -4 42 42'
								id      = 'icon'
								xmlns   = 'http://www.w3.org/2000/svg'
							>
								<path d="M26,22a3.9583,3.9583,0,0,0-2.02.5659L17.4141,16,23.981,9.4331A3.9521,3.9521,0,0,0,26,10a4,4,0,1,0-4-4,3.951,3.951,0,0,0,.5669,2.019L16,14.5859,9.4343,8.02A3.9577,3.9577,0,0,0,10,6a4,4,0,1,0-4,4,3.9583,3.9583,0,0,0,2.02-.5659L14.5859,16,8.019,22.5669A3.9521,3.9521,0,0,0,6,22a4,4,0,1,0,4,4,3.951,3.951,0,0,0-.5669-2.019L16,17.4141,22.5657,23.98A3.9577,3.9577,0,0,0,22,26a4,4,0,1,0,4-4ZM26,4a2,2,0,1,1-2,2A2.0023,2.0023,0,0,1,26,4ZM6,28a2,2,0,1,1,2-2A2.0023,2.0023,0,0,1,6,28Z"
									stroke       = 'currentColor'
									stroke-width = '1.4'
									transform="translate(0 0)">
								</path>
							</svg>
						</span>`;
				}

				return modeString;
			},
		},
		{
			headerName : 'Registration',
			filter     : true,
			width      : 256,
			tooltipValueGetter : (tourn) => {
				return `Deadlines in timezone ${ tourn.data.tz }`;
			},
			valueGetter : (tourn: RowData) => {
				const regStart = new Date(tourn.data.reg_start);
				const regEnd = new Date(tourn.data.reg_end);
				const tournEnd = new Date(tourn.data.end);

				if (tournEnd.getTime() < now.getTime()) {
					return `Ended`;
				}

				if (tourn.data.closed) {
					return `No Open Registration`;
				}

				if (regStart > now) {
					const startDate = showDate(regStart, 'shortText', tourn.data.tz, 'en-US');
					const startTime = showTime(regStart, 'humanShort', tourn.data.tz, 'en-US');
					return `Opens ${startDate} ${startTime} `;
				}

				if (regEnd > now) {
					const startDate = showDate(regEnd, 'shortText', tourn.data.tz, 'en-US');
					const startTime = showTime(regEnd, 'humanShort', tourn.data.tz, 'en-US');
					return `Due ${startDate} ${startTime} `;
				}

				return `Closed`;
			},
			cellRenderer : (tourn: RowData) => {

				const regStart = new Date(tourn.data.reg_start);
				const regEnd = new Date(tourn.data.reg_end);
				const tournEnd = new Date(tourn.data.end);

				if (tournEnd.getTime() < now.getTime()) {
					return `
						<div class='text-surface-900 dark:text-surface-100 font-medium text-xs text-center items-center italic w-full'>
							Ended
						</div>
					`;
				}

				if (tourn.data.closed) {
					return `
						<div class='text-error-900 lg:text-xs text-[10px] italic text-center'>
							No Open Registration
						</div>
					`;
				}

				if (regStart > now) {
					return `
						<div class='flex-auto flex-row justify-space md:flex-wrap'>
							<span class='inline-block lg:w-1/4 font-medium text-primary-600 dark:text-primary-100 w-auto'>
								Opens
							</span>
							<span class='inline-block lg:w-1/4 w-auto'>
								${ showDate(regStart, 'shortText', tourn.data.tz, 'en-US') }
							</span>
							<span class='inline-block lg:w-1/2 md:w-full'>
								${ showTime(regStart, 'humanShort', tourn.data.tz, 'en-US') }
							</span>
						</div>
					`;
				}

				if (regEnd > now) {
					return `
						<div class='flex justify-between flex-nowrap md:flex-wrap'>
							<span class='inline-block lg:w-[18%] font-medium text-success-600 dark:text-success-100
								w-auto pl-2 lg:pl-0 text-right lg:text-left
							'>
								Due
							</span>
							<span class='inline-block lg:w-[30%] text-right pr-1
								w-auto md:text-left md:pl-1
							'>
								${ showDate(regEnd, 'shortText', tourn.data.tz, 'en-US') }
							</span>
							<span class='
								inline-block text-right pr-1
								invisible md:w-0 md:h-0
								lg:visible lg:w-[52%]
							'>
								${ showTime(regEnd, 'humanShort', tourn.data.tz, 'en-US') }
							</span>
						</div>
					`;
				}

				return `
					<div class='text-surface-800 dark:text-surface-100 font-medium text-xs text-center italic w-full'>
						Closed
					</div>
				`;
			},
		},
		{
			headerName : 'Judge Signups',
			field      : 'signup',
			filter     : true,
		},
		{
			headerName : 'Events Offered',
			field      : 'events',
			filter     : true,
		},
		{
			headerName : 'Event Types',
			field      : 'eventTypes',
			hide       : true,
			filter     : true,
		},
	];

	const options:GridOptions = {
		columnDefs,
	};
	const themeOptions:ThemeOptions = {
		header     : 'Upcoming Tournaments',
		searchText : 'Search by names and events offered',
		fileName   : 'tabroom-public-tourns.csv',
	};

</script>

<div>
	{#if tournData.status === 'pending'}
		<span>Loading...</span>
	{:else if tournData.status === 'error'}
		<span>Error: {tournData.error.message}</span>
		<code>
			{ JSON.stringify(tournData, null, 2) }
		</code>
	{:else}
		<div class='px-4 w-full overflow-x-scroll'>
			<AgGrid
				data         = { tournData.data }
				options      = { options }
				themeOptions = { themeOptions }
			/>
		</div>

		{#if tournData.isFetching}
			<div style="color:darkgreen; font-weight:700">Background Updating...</div>
		{/if}
	{/if}
</div>
