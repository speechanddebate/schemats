
import type { Grid } from '@svar-ui/svelte-grid';

// Top level options added to the component that aren't processed by SVAR Grid.

export interface GridOptions {
	title?    : string,
	bigTitle? : boolean,
	noFilter? : boolean,
	tableOptions: Grid,
};

// Adds options that allow the FilterBar to work properly, as well as some
// formatting --CLP

import type { IColumn } from '@svar-ui/svelte-grid';

export type SchematColumn = IColumn & {
	columnClass?   : string,
	rowClass?      : string,
	filter?        : boolean,
	filterSort?    : number
	filterHeader?  : string
	filterOptions? : Array<string>,
};
