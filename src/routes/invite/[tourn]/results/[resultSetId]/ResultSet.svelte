<script lang="ts">
    import { ucfirst } from '$lib/helpers/text';
	import { onMount } from 'svelte';

	let {tourn, resultSet}  = $props();

	import SVGrid from '$lib/layouts/grid/SVGrid.svelte';
	import Identity from './Identity.svelte';

	import type { SchematColumn, GridOptions } from '$lib/layouts/grid/svgrid.js';
	import type { IRow } from '@svar-ui/svelte-grid';

	const columns:Array<SchematColumn> = $derived.by( () => {

		const baseColumns:Array<SchematColumn> = [
			{
				id     : 'id',
				width  : 50,
				hidden : true,
				filter : false,
			},
		];

		if (resultSet.tag !== 'scores'
			&& resultSet.tag !== 'table'
			&& !resultSet.noPlacement
		) {
			baseColumns.push({
				id          : 'place',
				header      : 'Place',
				width       : 48,
				columnClass : 'text-center',
				flexgrow    : 0,
			});
		}

		if (resultSet.entity === 'student') resultSet.entity = 'speaker';

		baseColumns.push({
			id       : resultSet.entity,
			header   : `${ucfirst(resultSet.entity)}`,
			cell     : Identity,
			key      : `${tourn.webname || ''}`,
			width    : 96,
			flexgrow : 1,
		});

		if (resultSet.entity !== 'school') {
			baseColumns.push({
				id       : 'school',
				header   : `School`,
				hidden   : true,
				width    : 96,
				flexgrow : 1,
				template : (value:string, row:IRow) => {
					return `${row.School?.code} ${row.School?.name}`;
				},
			});
		}

		if (resultSet.tag == 'chamber') {
			baseColumns.push({
				id       : 'section',
				columnClass : 'text-center',
				header   : {
					text: `Chamber`,
					vertical: true,
				},
				width    : 48,
				flexgrow : 0,
			});
		}

		Object.keys(resultSet.headers).forEach( (key) => {

			const header = resultSet.headers[key];
			const headerTag = header?.tag?.replace(/\s/g, '');

			let columnClass = 'text-right';
			let width = 54;

			if (header.tag == 'Round') width = 64;
			if (header.tag == 'Round') columnClass = 'text-center';

			baseColumns.push({
				id          : `${headerTag}-${header.Protocol?.id || 0}`,
				header: {
					text     : `${header?.tag}`,
					vertical : true,
				},
				width,
				columnClass,
				flexgrow    : 0,
				template    : (value:string, row:IRow) => {
					return row.values?.[key] || '';
				},
			});
		});

		return baseColumns;
	});

	// Add title headers to the column headers because SVAR doesn't do it. I'm
	// getting annoyed with them.

	onMount(() => {
		Object.keys(resultSet.headers).forEach( (key) => {
			const header = resultSet.headers[key];
			const headerTag = `:${header.tag?.replace(/\s/g, '')}-${header.Protocol?.id}`;

			const columnHeader:HTMLElement | null = document.querySelector(`[data-header-id="${headerTag}"]`);

			if (columnHeader) {
				columnHeader.title = `${header.description}`;
				// because apparently we cannot have separate formatting for headers?
				columnHeader.classList?.remove('text-right');
			}
		});
	});

	const options:GridOptions = $derived({
		title    : resultSet.label,
		bigTitle : false,
		reorder  : true,
		noPager  : true,
		noFilter : true,
	});

</script>

	<div class='px-3 overflow-x-scroll pb-3 bg-back wg-full text-success-600'>
		<SVGrid
			columns = { columns }
			data    = { resultSet.results }
			options = { options }
		/>
	</div>

