
import type { Grid } from '@svar-ui/svelte-grid';

// Top level options added to the component that aren't processed by SVAR Grid.

export interface GridOptions {
	title?    : string,
	subTitle? : string,
	noTitle?  : boolean,
	bigTitle? : boolean,
	noFilter? : boolean,
	noPager?  : boolean,
	limit?    : number,
	papersize? : 'letter' | 'a3' | 'a4',
	filename?  : string,
	tableOptions?: Grid,
};

// Adds options that allow the FilterBar to work properly, as well as some
// formatting --CLP

import type { IColumn } from '@svar-ui/svelte-grid';

/**
 * a column definition for the SVGrid
 */
export type SchematColumn = IColumn & {
	id             : number | string,
	//key            : string,
	columnClass?   : string,
	rowClass?      : string,
	filter?        : boolean,
	filterSort?    : number
	filterHeader?  : string
	filterOptions? : Array<string>,
	linkFunction?  : function,
};
