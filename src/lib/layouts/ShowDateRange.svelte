<script lang='ts'>
	import { DateTime } from 'luxon';

	const endash = '&ndash;';

	let {
		dtStart,
		dtEnd,
		dtStartISO,
		dtEndISO,
		dtStartString,
		dtEndString,
		tz     = 'system',
		format = 'medtext',
		mode   = 'dt',
		dateClass,
		timeClass,
		divClass = 'flex w-full',
		locale,
		showFullTz,
		showTz,
		noSpan,
	} : {
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
		dateClass?     : string,
		timeClass?     : string,
		divClass?      : string,
	}= $props();

	let startDt = DateTime.local();
	let endDt;

	if (dtStart) {
		startDt = DateTime.fromJSDate(dtStart).setZone(tz);
	} else if (dtStartISO) {
		startDt = DateTime.fromISO(dtStartISO).setZone(tz);
	} else if (dtStartString) {
		startDt = DateTime.fromSQL(dtStartString).setZone(tz);
	}

	if (dtEnd) {
		endDt = DateTime.fromJSDate(dtEnd).setZone(tz);
	} else if (dtEndISO) {
		endDt = DateTime.fromISO(dtEndISO).setZone(tz);
	} else if (dtEndString) {
		endDt = DateTime.fromSQL(dtEndString).setZone(tz);
	}

	if (locale) {
		startDt = startDt.setLocale(locale);
		endDt = endDt.setLocale(locale);
	}

	let dateOutput = $state('');
	let timeOutput = $state('');
	let diffPoint = '';

	if (mode !== 'time') {

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

			switch (format) {
				case 'short':
					dateOutput = ` ${ startDt.toLocaleString({ month: 'numeric', day: 'numeric' }) }`;
					dateOutput += ` — ${ endDt.toLocaleString({ month: 'numeric', day: 'numeric' }) }`;
					break;

				case 'long' :
					dateOutput = ` ${ startDt.toLocaleString({ month: 'long' , day: 'numeric' }) }`;
					dateOutput += ` — ${ endDt.toLocaleString({ month: 'long'  , day: 'numeric' }) }`;
					break;

				case 'full' :
					dateOutput = ` ${ startDt.toLocaleString({ month: 'long' , day: 'numeric' }) }`;
					dateOutput += ` — ${ endDt.toLocaleString({ month: 'long'  , day: 'numeric' }) }`;
					dateOutput += ` (
						${endDt.toLocaleString({ weekday: 'short' })} — ${startDt.toLocaleString({ weekday: 'short' })}
					)`;
					break;

				default:
					dateOutput = ` ${ startDt.toLocaleString({ month: 'short' , day: 'numeric' }) }`;
					dateOutput += ` — ${ endDt.toLocaleString({ month: 'short'  , day: 'numeric' }) }`;
			}

			if (format !== 'short') {
				dateOutput += `, ${startDt.toLocaleString({ year : 'numeric' })}`;
			}

		} else if (diffPoint === 'day') {

			switch (format) {
				case 'short':
					dateOutput = ` ${ startDt.toLocaleString({ month: 'numeric' }) }`;
					break;

				case 'long' :
					dateOutput = ` ${ startDt.toLocaleString({ month: 'long' }) }`;
					break;

				default:
					dateOutput = ` ${ startDt.toLocaleString({ month: 'short' }) }`;
			}

			dateOutput += ` ${ startDt.toLocaleString({ day: 'numeric' }) }`;
			dateOutput += ` — ${ endDt.toLocaleString({ day: 'numeric' }) }`;

			if (format !== 'short') {
				dateOutput += startDt.toLocaleString({ year : 'numeric' });
			}

		} else {

			switch (format) {
				case 'short':
					dateOutput = ` ${ startDt.toLocaleString(DateTime.DATE_SHORT) }`;
					break;

				case 'full' :
					dateOutput = ` ${ startDt.toLocaleString(DateTime.DATE_FULL) }`;
					break;

				case 'long' :
					dateOutput = ` ${ startDt.toLocaleString(DateTime.DATE_LONG) }`;
					break;

				case 'medday':
					dateOutput = ` ${ startDt.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY) }`;
					break;

				default:
					dateOutput = ` ${ startDt.toLocaleString(DateTime.DATE_MED) }`;
			}
		}
	}

	if (mode === 'time' ||
		(mode === 'datetime' && diffPoint == '')
	) {

		switch (format) {

			case 'short':
				timeOutput += ` ${ startDt.toLocaleString(DateTime.TIME_SIMPLE) }`
					.replace(' AM', 'a')
					.replace(' PM', 'p');

				timeOutput += ` — ${ endDt.toLocaleString(DateTime.TIME_SIMPLE) }`
					.replace(' AM', 'a')
					.replace(' PM', 'p');

				break;

			default :
				timeOutput += ` ${ startDt.toLocaleString(DateTime.TIME_SIMPLE) }`;
				timeOutput += ` to ${ endDt.toLocaleString(DateTime.TIME_SIMPLE) }`;
		}

	} else if (mode == 'datetime') {

		switch (format) {

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
				timeOutput += ` to ${ endDt.toLocaleString({ weekday: 'short' }) } `;
				timeOutput += ` ${ endDt.toLocaleString(DateTime.TIME_SIMPLE) }`;
		}
	}

	if (showFullTz) {
		timeOutput += ` ${startDt.toFormat('z')}`;
	} else if (showTz) {
		timeOutput += ` ${startDt.toFormat('ZZZZ')}`;
	}

</script>

	{#if noSpan}
		<div class="{divClass}">
			{ dateOutput }
			{ timeOutput }
		</div>
	{:else }
		<div class="{divClass}">
			<span class="{dateClass || 'text-start pl-4'}">
				{ dateOutput }
			</span>
			<span class="{timeClass || 'text-end pr-4'}">
				{ timeOutput }
			</span>
		</div>
	{/if}