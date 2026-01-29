// I never thought I'd say this about anything, but dear lord JS date handling
// makes me miss DateTime in Perl.
import { DateTime } from 'luxon';

export interface dtInput {
	dtStart?       : Date,
	dtEnd?         : Date,
	dtStartISO?    : string,
	dtEndISO?      : string,
	dtStartString? : string,
	dtEndString?   : string,
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
};

// For mode, 'time' is time only (9:00 AM to 2:30 PM)
// 'date' is date only (Feb 1st-4th, Dec 31-Jan 2nd)
// 'datetime' is (Feb 1st - 7th, 9:00 AM to 8:00 PM)
// 'full' is (Feb 1st 9:00 AM - Feb 7th, 5:00 PM)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertTZ = (date : any, tzString : string) => {
	return new Date(
		(typeof date === 'string' ? new Date(date) : date)
		.toLocaleString('en-US', {timeZone: tzString})
	);
};

export const shortZone = (tzString : string, date = new Date()) => {
	const dateZone = date.toLocaleDateString('en-US', {
		timeZone     : tzString,
		timeZoneName : 'short',
	});

	const numWords = dateZone.split(' ');
	return numWords[numWords.length - 1];
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const getWeek = (date:any) => {
	if (!(date instanceof Date)) date = new Date();

	// ISO week date weeks start on Monday, so correct the day number
	const nDay = (date.getDay() + 6) % 7;

	// ISO 8601 states that week 1 is the week with the first Thursday of that year
	// Set the target date to the Thursday in the target week
	date.setDate(date.getDate() - nDay + 3);

	// Store the millisecond value of the target date
	const n1stThursday = date.valueOf();

	// Set the target to the first Thursday of the year
	// First, set the target to January 1st
	date.setMonth(0, 1);

	// Not a Thursday? Correct the date to the next Thursday
	if (date.getDay() !== 4) {
		date.setMonth(0, 1 + ((4 - date.getDay()) + 7) % 7);
	}

	// The week number is the number of weeks between the first Thursday of the year
	// and the Thursday in the target week (604800000 = 7 * 24 * 3600 * 1000)
	return 1 + Math.ceil((n1stThursday - date) / 604800000);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const showDate =  (date: any, format: string, tz: string, locale: string) => {

	const dt = convertTZ(date, tz || 'UTC');

	if (!format || format === 'iso' || format === 'sortable') {
		return dt.toISOString().split('T')[0];
	}

	if (format === 'long') {
		const options:Intl.DateTimeFormatOptions = {
			weekday : 'short',
			year    : 'numeric',
			month   : 'long',
			day     : 'numeric',
		};
		return dt.toLocaleDateString(locale || 'en-US', options);
	}

	if (format === 'medium') {
		const options:Intl.DateTimeFormatOptions = {
			weekday   : 'short',
			month     : 'short',
			day       : 'numeric',
		};
		return dt.toLocaleDateString(locale || 'en-US', options);
	}

	if (format === 'short') {
		const options:Intl.DateTimeFormatOptions = {
			month     : 'short',
			day       : 'numeric',
		};
		return dt.toLocaleDateString(locale || 'en-US', options);
	}

	return dt.toLocaleDateString(locale || 'en-US');
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const showTime =  (date: any, format: string, tz: string, locale: string) => {

	const dt = convertTZ(date, tz || 'UTC');
	const tzString = shortZone(tz);

	if (!format || format === 'iso' || format === 'sortable') {
		return dt.toISOString().split('T')[0];
	}

	if (format === 'murica' || format === 'human') {
		return dt.toLocaleTimeString(locale || 'en-US');
	}

	if (format === 'muricaShort' || format === 'humanShort') {
		const options:Intl.DateTimeFormatOptions = {
			hour         : 'numeric',
			hour12       : true,
			minute       : 'numeric',
		};

		return `${dt.toLocaleTimeString(locale || 'en-US', options)} ${tzString}`;
	}

	if (format === 'short') {
		const options:Intl.DateTimeFormatOptions = {
			hour         : 'numeric',
			hour12       : true,
			minute       : 'numeric',
		};

		return `${dt.toLocaleTimeString(locale || 'en-US', options)}`;
	}
};

export interface FormattedRanges {
	fullOutput? : string,
	dateOutput? : string,
	timeOutput? : string,
	error?      : string,
};

export const showDateRange = (inputData:dtInput): FormattedRanges => {

	let startDt:DateTime = DateTime.local();
	let endDt:DateTime;

	if (inputData.dtStart) {
		startDt = DateTime.fromJSDate(inputData.dtStart).setZone(inputData.tz);
	} else if (inputData.dtStartISO) {
		startDt = DateTime.fromISO(inputData.dtStartISO).setZone(inputData.tz);
	} else if (inputData.dtStartString) {
		startDt = DateTime.fromSQL(inputData.dtStartString).setZone(inputData.tz);
	} else {
		// If I have no start date, then I can have no range.
		return {
			error: 'No start date input sent',
		};
	}

	if (inputData.dtEnd) {
		endDt = DateTime.fromJSDate(inputData.dtEnd).setZone(inputData.tz);
	} else if (inputData.dtEndISO) {
		endDt = DateTime.fromISO(inputData.dtEndISO).setZone(inputData.tz);
	} else if (inputData.dtEndString) {
		endDt = DateTime.fromSQL(inputData.dtEndString).setZone(inputData.tz);
	} else {
		// If I have no end date, then I can have no range.
		return {
			error: 'No end date input sent',
		};
	}

	if (inputData.locale) {
		startDt = startDt.setLocale(inputData.locale);
		if (endDt) {
			endDt = endDt.setLocale(inputData.locale);
		}
	}

	if (inputData.mode === 'full') {

		let fullOutput = '';

		fullOutput += showDate(
			startDt,
			inputData.format || 'murica',
			inputData.tz || 'UTC',
			inputData.locale || 'en-US'
		);

		fullOutput += ' - ';

		fullOutput += showDate(
			endDt,
			inputData.format || 'murica',
			inputData.tz || 'UTC',
			inputData.locale || 'en-US'
		);

		if (inputData.showTz && inputData.tz) {
			fullOutput += shortZone(inputData.tz);
		}

		return {
			fullOutput,
		};
	}

	let dateOutput = '';
	let timeOutput = '';
	let diffPoint = '';

	if (inputData.mode !== 'time') {

		// Find the point where the dates differ, if they do at all

		if (endDt.toLocaleString({ year: 'numeric' })
			!== startDt.toLocaleString({ year: 'numeric' })
		) {
			diffPoint = 'year';
		} else if (endDt.toLocaleString({ month: 'numeric' })
			!== startDt.toLocaleString({ month: 'numeric' })
		) {
			diffPoint = 'month';
		} else if (endDt.toLocaleString({ day: 'numeric' })
			!== startDt.toLocaleString({ day: 'numeric' })
		) {
			diffPoint = 'day';
		}

		if (diffPoint === 'month') {

			switch (inputData.format) {
				case 'short':
					dateOutput = ` ${ startDt.toLocaleString({ month: 'numeric', day: 'numeric' }) }`;
					dateOutput += ` - ${ endDt.toLocaleString({ month: 'numeric', day: 'numeric' }) }`;
					break;

				case 'long' :
					dateOutput = ` ${ startDt.toLocaleString({ month: 'long' , day: 'numeric' }) }`;
					dateOutput += ` - ${ endDt.toLocaleString({ month: 'long'  , day: 'numeric' }) }`;
					break;

				case 'full' :
					dateOutput = ` ${ startDt.toLocaleString({ month: 'long' , day: 'numeric' }) }`;
					dateOutput += ` - ${ endDt.toLocaleString({ month: 'long'  , day: 'numeric' }) }`;
					dateOutput += ` (
						${endDt.toLocaleString({ weekday: 'short' })} — ${startDt.toLocaleString({ weekday: 'short' })}
					)`;
					break;

				default:
					dateOutput = ` ${ startDt.toLocaleString({ month: 'short' , day: 'numeric' }) }`;
					dateOutput += ` - ${ endDt.toLocaleString({ month: 'short'  , day: 'numeric' }) }`;
			}

			if (inputData.format !== 'short') {
				dateOutput += `, ${startDt.toLocaleString({ year : 'numeric' })}`;
			}

		} else if (diffPoint === 'day') {

			switch (inputData.format) {
				case 'short':
					dateOutput = ` ${ startDt.toLocaleString({ month: 'numeric' }) }/`;
					break;

				case 'long' :
					dateOutput = ` ${ startDt.toLocaleString({ month: 'long' }) } `;
					break;

				case 'medday':
					dateOutput = ` ${ startDt.toLocaleString({ weekday: 'short' }) },`;
					dateOutput += ` ${ startDt.toLocaleString({ month: 'short' }) } `;
					break;

				default:
					dateOutput = ` ${ startDt.toLocaleString({ month: 'short' }) } `;
			}

			dateOutput += `${ startDt.toLocaleString({ day: 'numeric' }) }`;

			if (inputData.format === 'medday') {
				dateOutput += ` to`;
				dateOutput += ` ${ endDt.toLocaleString({ weekday: 'short' }) },`;
				dateOutput += ` ${ startDt.toLocaleString({ month: 'short' }) }`;
			} else {
				dateOutput += ` -`;
			}

			dateOutput += ` ${ endDt.toLocaleString({ day: 'numeric' }) }`;

			if (inputData.format !== 'short') {
				dateOutput += `, ${ startDt.toLocaleString({ year : 'numeric' }) } `;
			}

		} else {

			switch (inputData.format) {
				case 'short':
					dateOutput = ` ${ startDt.toLocaleString({ month: 'numeric' , day: 'numeric' }) }`;
					break;

				case 'medday':
					dateOutput = ` ${ startDt.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY) }`;
					break;

				case 'full' :
					dateOutput = ` ${ startDt.toLocaleString(DateTime.DATE_FULL) }`;
					break;

				case 'long' :
					dateOutput = ` ${ startDt.toLocaleString(DateTime.DATE_HUGE) }`;
					break;

				default:
					dateOutput = ` ${ startDt.toLocaleString(DateTime.DATE_MED) }`;
			}
		}
	}

	if (inputData.mode === 'time' ||
		(inputData.mode === 'datetime' && diffPoint == '')
	) {

		switch (inputData.format) {

			case 'short':
				timeOutput += ` ${ startDt.toLocaleString(DateTime.TIME_SIMPLE) }`
					.replace(' AM', 'a')
					.replace(' PM', 'p');

				timeOutput += ` - ${ endDt.toLocaleString(DateTime.TIME_SIMPLE) }`
					.replace(' AM', 'a')
					.replace(' PM', 'p');

				break;

			default :
				timeOutput += ` ${ startDt.toLocaleString(DateTime.TIME_SIMPLE) }`;
				timeOutput += ` - ${ endDt.toLocaleString(DateTime.TIME_SIMPLE) }`;
		}

	} else if (inputData.mode == 'datetime') {

		switch (inputData.format) {

			case 'short':
				timeOutput += ` ${ startDt.toLocaleString({ weekday: 'short' }) } `;
				timeOutput += ` ${ startDt.toLocaleString(DateTime.TIME_SIMPLE) }`
					.replace(' AM', 'a')
					.replace(' PM', 'p');

				timeOutput += ` — ${ endDt.toLocaleString({ weekday: 'short' }) } `;
				timeOutput += ` ${ endDt.toLocaleString(DateTime.TIME_SIMPLE) }`
					.replace(' AM', 'a')
					.replace(' PM', 'p');

				break;

			default :
				timeOutput += ` ${ startDt.toLocaleString({ weekday: 'short' }) } `;
				timeOutput += ` ${ startDt.toLocaleString(DateTime.TIME_SIMPLE) }`;
				timeOutput += ` - ${ endDt.toLocaleString({ weekday: 'short' }) } `;
				timeOutput += ` ${ endDt.toLocaleString(DateTime.TIME_SIMPLE) }`;
		}
	}

	if (inputData.mode === 'date') {
		if (inputData.showFullTz) {
			dateOutput += ` - ${startDt.toFormat('z')}`;
		} else if (inputData.showTz) {
			dateOutput += ` - ${startDt.toFormat('ZZZZ')}`;
		}
	} else {
		if (inputData.showFullTz) {
			timeOutput += ` ${startDt.toFormat('z')}`;
		} else if (inputData.showTz) {
			timeOutput += ` ${startDt.toFormat('ZZZZ')}`;
		}
	}

	return {
		dateOutput,
		timeOutput,
	};
};

export default showDateRange;