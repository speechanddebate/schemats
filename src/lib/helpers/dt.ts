
import { DateTime } from 'luxon';

interface dtInput {
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
	mode?          : string,
	locale?        : string,
};

export const showDateRange = ( inputData:dtInput ) => {

	let startDt: DateTime = DateTime.local();
	let endDt: DateTime;

	if (inputData.dtStart) {
		startDt = DateTime.fromJSDate(inputData.dtStart).setZone(inputData.tz);
	} else if (inputData.dtStartISO) {
		startDt = DateTime.fromISO(inputData.dtStartISO).setZone(inputData.tz);
	} else if (inputData.dtStartString) {
		startDt = DateTime.fromSQL(inputData.dtStartString).setZone(inputData.tz);
	} else {
		// If I have no start date, then I can have no range.
		return;
	}

	if (inputData.dtEnd) {
		endDt = DateTime.fromJSDate(inputData.dtEnd).setZone(inputData.tz);
	} else if (inputData.dtEndISO) {
		endDt = DateTime.fromISO(inputData.dtEndISO).setZone(inputData.tz);
	} else if (inputData.dtEndString) {
		endDt = DateTime.fromSQL(inputData.dtEndString).setZone(inputData.tz);
	} else {
		// If I have no end date, then I can have no range.
		return;
	}

	if (inputData.locale) {
		startDt = startDt.setLocale(inputData.locale);
		if (endDt) {
			endDt = endDt.setLocale(inputData.locale);
		}
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
					dateOutput = ` ${ startDt.toLocaleString({ month: 'numeric' }) }`;
					break;

				case 'long' :
					dateOutput = ` ${ startDt.toLocaleString({ month: 'long' }) }`;
					break;

				case 'medday':
					dateOutput = ` ${ startDt.toLocaleString({ weekday: 'short' }) },`;
					dateOutput += ` ${ startDt.toLocaleString({ month: 'short' }) }`;
					break;

				default:
					dateOutput = ` ${ startDt.toLocaleString({ month: 'short' }) }`;
			}

			dateOutput += ` ${ startDt.toLocaleString({ day: 'numeric' }) }`;
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
					dateOutput = ` ${ startDt.toLocaleString(DateTime.DATE_SHORT) }`;
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