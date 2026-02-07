
import { type DateTime } from 'luxon';

export interface DtRangeProps {
	startDateTime? : DateTime,
	startDt?       : Date,
	startISO?      : string,
	startString?   : string,
	endDateTime?   : DateTime,
	endDt?         : Date,
	endISO?        : string,
	endString?     : string,
	showTz?        : boolean,
	noSpan?        : boolean,
	showFullTz?    : boolean,
	tz?            : string,
	format?        : string,
	mode?          : 'time'|'date'|'datetime'|'full',
	locale?        : string,
	spanClass?     : string,
	timeClass?     : string,
	dateClass?     : string,
	joinWord?      : string,
}

export interface DtProps {
	dateTime?   : DateTime,
	dt?         : Date,
	dtISO?      : string,
	dtString?   : string,
	showTz?     : boolean,
	showFullTz? : boolean,
	tz?         : string,
	format?     : string,
	mode?       : string,
	locale?     : string,
	spanClass?  : string,
	joinWord?   : string,
}

export interface FormattedRanges {
	fullOutput? : string,
	dateOutput? : string,
	timeOutput? : string,
	error?      : string,
}