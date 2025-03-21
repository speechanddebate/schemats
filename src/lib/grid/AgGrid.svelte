<script lang='ts'>
	import {
		type GridOptions,
		type Module,
		type GridApi,
		type GridParams,
		type GridTheme,
		createGrid,
	} from '@ag-grid-community/core';

	type TRow = object;
	type TData = TRow[];

	import { onMount } from 'svelte';
	import SvelteFrameworkOverrides from './SvelteFrameworkOverrides.svelte';
	import initialGridOptionsList from './initialGridOptionsSet';

	interface Props {
		gridOptions       : GridOptions<TData>;
		rowData?          : TData;
		modules?          : Module[];
		gridClass?        : string;
		gridStyle?        : string;
		quickFilterText?  : string;
		sizeColumnsToFit? : boolean;
		theme?            : GridTheme;
	}

	let {
		gridOptions,
		rowData,
		modules,
		gridClass,
		gridStyle,
		quickFilterText,
		sizeColumnsToFit = true,
	}: Props = $props();

	let api: GridApi<TData> | undefined = $state(undefined);
	let divContainerEl: HTMLDivElement | undefined = $state();

	const gridParams: GridParams = {
		modules: modules ?? [],
		frameworkOverrides: new SvelteFrameworkOverrides(),
	};

	$effect(() => {
		const updatedOptions: GridOptions<TData> = {};
		for (const key in gridOptions) {
			if (!initialGridOptionsList.has(key)) {
				// @ts-expect-error because I said so, and it's my code dammit.
				updatedOptions[key] = gridOptions[key];
			}
		}

		api?.updateGridOptions(updatedOptions);
	});

	// Update grid on data change + init
	$effect(() => {
		api?.setGridOption('rowData', rowData);
	});

	$effect(() => {
		if (quickFilterText !== undefined) {
			api?.setGridOption('quickFilterText', quickFilterText);
		}
	});

	onMount(() => {
		api = createGrid(divContainerEl!, gridOptions, gridParams);
		if (sizeColumnsToFit) api.sizeColumnsToFit();

		return () => {
			api?.destroy();
		};
	});

	export const csvExport = () => {
		console.log(`Hola, we are doing the right table now!`);
		api?.exportDataAsCsv();
	};

</script>

<div
	style     = {gridStyle}
	bind:this = {divContainerEl}
	class     = {gridClass ?? 'ag-theme-quartz'}
></div>
