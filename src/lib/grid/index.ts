import AgGrid from './AgGrid.svelte';
import makeSvelteCellRenderer from './makeSvelteCellRenderer.svelte';

export { AgGrid, makeSvelteCellRenderer };
import { type GridOptions } from 'ag-grid-community';

export interface gridThemeOptions {
	fileName?    : string,
	header?      : string,
	searchText?  : string,
	searchStyle? : string,
	gridStyle?   : string,
	gridClass?   : string,
}

export interface gridProps<TData> {
	data          : TData[],
	options?      : GridOptions<TData>,
	themeOptions? : gridThemeOptions,
}

// These framework files taken from
// https://github.com/bn-l/ag-grid-svelte5-extended, and were ripped apart and
// re-created here both because the original project was a little new so I'm
// worried it may not be around in the future, especially since it's
// essentially a stopgap. --CLP