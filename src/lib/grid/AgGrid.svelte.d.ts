import { type GridOptions, type Module, type GridTheme } from '@ag-grid-community/core';

declare class __sveltets_Render<TData> {
	props(): {
		initialOptions: GridOptions<TData>;
		updateOptions?: Omit<GridOptions<TData>, 'getRowId'> | undefined;
		/**
		 * Include a id property on row objects you pass to this or a getRowId() function
		 * to initialOptions.
		 */
		rowData?          : TData[] | undefined;
		modules?          : Module[];
		gridClass?        : string;
		quickFilterText?  : string;
		sizeColumnsToFit? : boolean;
		theme?            : GridTheme;
	};
	events()   : {};
	slots()    : {};
	bindings() : '';
	exports()  : {};
}
interface $$IsomorphicComponent {
	new <TData>(options: import('svelte').ComponentConstructorOptions<ReturnType<__sveltets_Render<TData>['props']>>): import('svelte').SvelteComponent<ReturnType<__sveltets_Render<TData>['props']>, ReturnType<__sveltets_Render<TData>['events']>, ReturnType<__sveltets_Render<TData>['slots']>> & {
		$$bindings?: ReturnType<__sveltets_Render<TData>['bindings']>;
	} & ReturnType<__sveltets_Render<TData>['exports']>;
	<TData>(internal: unknown, props: ReturnType<__sveltets_Render<TData>['props']> & {}): ReturnType<__sveltets_Render<TData>['exports']>;
	z_$$bindings?: ReturnType<__sveltets_Render<any>['bindings']>;
}
declare const AgGrid: $$IsomorphicComponent;
type AgGrid<TData> = InstanceType<typeof AgGrid<TData>>;
export default AgGrid;