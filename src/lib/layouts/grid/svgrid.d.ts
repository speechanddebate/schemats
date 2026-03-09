
// Top level options added to the component that aren't processed by SVAR Grid.

export interface GridOptions {
	title?    : string,
	bigTitle? : boolean,
	reorder   : boolean,
	// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
	columnStyle? : Function,
	// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
	rowStyle? : Function,
	noFilter? : boolean,
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
