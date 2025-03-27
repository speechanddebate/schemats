// I never thought I'd say this about anything, but dear lord JS date handling
// makes me miss DateTime in Perl.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertTZ = (date : any, tzString : string) => {
	return new Date(
		(typeof date === 'string' ? new Date(date) : date)
		.toLocaleString('en-US', {timeZone: tzString})
	);
};

export const shortZone = (tzString : string) => {
	const dateZone = new Date().toLocaleDateString('en-US', {
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

	if (format === 'murica' || format === 'human') {
		return dt.toLocaleDateString(locale || 'en-US');
	}

	if (format === 'muricaShort' || format === 'humanShort') {

		const options = {
			weekday   : 'short',
			month     : 'short',
			day       : 'numeric',
		};

		return dt.toLocaleDateString(locale || 'en-US', options);
	}

	if (format === 'shortText') {
		const options = {
			month     : 'short',
			day       : 'numeric',
		};

		return dt.toLocaleDateString(locale || 'en-US', options);
	}
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

		const options = {
			hour         : 'numeric',
			hour12       : true,
			minute       : 'numeric',
		};

		return `${dt.toLocaleTimeString(locale || 'en-US', options)} ${tzString}`;
	}

	if (format === 'short') {

		const options = {
			hour         : 'numeric',
			hour12       : true,
			minute       : 'numeric',
		};

		return `${dt.toLocaleTimeString(locale || 'en-US', options)}`;
	}
};
