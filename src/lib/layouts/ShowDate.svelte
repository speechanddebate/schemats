<script lang='ts'>

	// A component to show the input date in various formatting.  I hopefully
	// will never have the Date() module show up anywhere but here, the ranger
	// and the helper, so when Temporal is ready for prime time I can just rip
	// it through this.

	import { DateTime } from 'luxon';

	interface showDateProps {
		dt?          : Date,
		dtISO?       : string,
		dtString?    : string,
		showTz?      : boolean,
		showFullTz?  : boolean,
		tz?          : string,
		format?      : string,
		mode?        : string,
		locale?      : string,
		spanClass?   : string,
	};

	let {
		dt,
		dtISO,
		dtString,
		tz     = 'system',
		format = 'medtext',
		mode   = 'dt',
		spanClass,
		locale,
		showFullTz,
		showTz,
	}:showDateProps = $props();

	let startDt = $derived.by( () => {

		let rawDt:DateTime = DateTime.local();

		if (dt) {
			rawDt = DateTime.fromJSDate(dt).setZone(tz);
		} else if (dtISO) {
			rawDt = DateTime.fromISO(dtISO).setZone(tz);
		} else if (dtString) {
			rawDt = DateTime.fromSQL(dtString).setZone(tz);
		}

		return rawDt.setLocale(locale || 'en-US');
	});

	let dateOutput:string | null = $derived.by(  () => {

		let formattedDate:string|null = '';

		switch (format) {

			case 'iso': // Single Date
				switch (mode) {
					case 'time': // 11:32:00.000-04:00
						formattedDate = startDt.toISOTime();
						break;

					case 'date': // 2017-04-20
						formattedDate = startDt.toISO();
						break;

					default: // 2017-04-20T11:32:00.000-04:00
						formattedDate = startDt.toISODate();
						break;
				}
				break;

			case 'sortable': // Unix Epoch in seconds
				formattedDate = startDt.toLocaleString(DateTime.DATE_SHORT);
				formattedDate += `, ${startDt.toUnixInteger()}`;
				break;

			case 'full': // October 14, 1983 at 1:30 PM EDT

				switch (mode) {
					case 'time': // 11:32:00.000-04:00
						formattedDate = startDt.toLocaleString(DateTime.TIME_SIMPLE);
						break;

					case 'date': // 2017-04-20
						formattedDate = startDt.toLocaleString(DateTime.DATE_FULL);
						break;

					default: // 2017-04-20T11:32:00.000-04:00
						formattedDate = startDt.toLocaleString(DateTime.DATETIME_FULL);
						showTz = false;
				}
				break;

			case 'dayonly': //Fri
				formattedDate = ` ${startDt.toLocaleString({weekday : 'short'})}`;
				showTz = false;
				break;

			case 'daytime': //Fri at 2:00PM
				formattedDate = ` ${startDt.toLocaleString({weekday : 'short'})} at `;
				formattedDate += startDt.toLocaleString(DateTime.TIME_SIMPLE);
				showTz = false;
				break;

			case 'medday': // Fri, Oct 14, 1983, 1:30 PM
				switch (mode) {
					case 'date': // 2017-04-20
						formattedDate = startDt.toLocaleString(DateTime.DATE_MED_WITH_WEEKDAY);
						break;

					default: // 2017-04-20T11:32:00.000-04:00
						formattedDate = startDt.toLocaleString(DateTime.DATETIME_MED_WITH_WEEKDAY);
						showTz = false;
				}
				break;

			case 'med': // Oct 14, 1983, 1:30 PM
				switch (mode) {
					case 'date':
						formattedDate = startDt.toLocaleString(DateTime.DATE_MED);
						break;

					case 'time':
						formattedDate = startDt.toLocaleString(DateTime.TIME_SIMPLE);
						break;

					default:
						formattedDate = startDt.toLocaleString(DateTime.DATETIME_MED);
				}
				break;

			case 'short': // 10/14/1983, 1:30 PM

				switch (mode) {
					case 'date':
						formattedDate = startDt.toLocaleString(DateTime.DATE_SHORT);
						break;

					case 'time':
						formattedDate = startDt.toLocaleString(DateTime.TIME_SIMPLE);
						break;

					default:
						formattedDate = startDt.toLocaleString(DateTime.DATETIME_SHORT);
				}
				break;

			case 'shorter': // 10/14 1:30 PM

				switch (mode) {
					case 'date':
						formattedDate = startDt.toLocaleString({
							month : 'numeric',
							day   : 'numeric',
						});
						break;

					case 'time':
						formattedDate = startDt.toLocaleString({
							hour   : 'numeric',
							minute : 'numeric',
						});
						break;

					default:
						formattedDate = startDt.toLocaleString({
							month  : 'numeric',
							day    : 'numeric',
							hour   : 'numeric',
							minute : 'numeric',
						});
				}

				formattedDate = formattedDate.replace(' AM', 'a');
				formattedDate = formattedDate.replace(' PM', 'p');
				break;

			case 'shortday': // Mon, Oct 14, 1:30P

				switch (mode) {
					case 'date':
						formattedDate = startDt.toLocaleString({
							weekday : 'short',
							month   : 'short',
							day     : 'numeric',
						});
						break;

					case 'time':
						formattedDate = startDt.toLocaleString(DateTime.TIME_SIMPLE);
						break;

					default:
						formattedDate = startDt.toLocaleString({
							weekday : 'short',
							month   : 'short',
							day     : 'numeric',
							hour    : 'numeric',
							minute  : 'numeric',
						})
							.replace(' AM', 'a')
							.replace(' PM', 'p');
				}
				break;

			default: // Oct 14, 1:30P

				switch (mode) {
					case 'date':
						formattedDate = startDt.toLocaleString({
							month   : 'short',
							day     : 'numeric',
						});
						break;

					case 'time':
						formattedDate = startDt.toLocaleString(DateTime.TIME_SIMPLE);
						break;

					default:
						formattedDate = startDt.toLocaleString({
							month  : 'short',
							day    : 'numeric',
							hour   : 'numeric',
							minute : 'numeric',
						})
							.replace(' AM', 'a')
							.replace(' PM', 'p');
				}
				break;
		}

		if (showFullTz) {
			formattedDate += ` ${startDt.toFormat('z')}`;
		} else if (showTz) {
			formattedDate += ` ${startDt.toFormat('ZZZZ')}`;
		}

		return formattedDate;
	});

</script>

	<span class="${spanClass}">
		{ dateOutput }
	</span>