export const addZero = (i:number):string => {
	if (i < 10) {
		const paddedString:string = `0${i}`;
		return paddedString;
	}
	return i.toString();
};

// one of the things I miss from Perl tbh
export const ucfirst = (lowered:string) => {
	if (lowered) {
		return String(lowered).charAt(0).toUpperCase() + String(lowered).slice(1);
	}
};

export const eventType = (rawType:string) => {
	if (rawType === 'mock_trial') return 'Mock Trial';
	if (rawType === 'wsdc') return 'World Schools';
	if (rawType === 'wudc') return 'British Parliamentary';
	return ucfirst(rawType);
};

export const publishLevel = (keyLevel:number) => {
	if (keyLevel == 1) return 'full';
	if (keyLevel == 1) return 'noJudges';
	if (keyLevel == 3) return 'entryList';
	if (keyLevel == 4) return 'thisPageIntentionallyLeftBlank';
	if (keyLevel == 5) return 'prelimChambers';
};

export const snakeToCamel = (snaked:string) => {
	snaked.toLowerCase().replace(/([-_][a-z])/g, (group) =>
		group.toUpperCase().replace('-', '').replace('_', '')
	);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const intersection = (array1: Array<any>, array2: Array<any>) => {
	return array1.filter(x => array2.includes(x));
};

// I would have sworn there'd be some locale based way to do this. But not that
// I could find. Granted I searched for all of three minutes but I feel if it
// existed it would have shown up in that amount of looking.
export const ordinate = (digit:number, lang?: string) => {
	if (lang === 'fr') {
		if (digit === 1) return 'er';
		return 'e';
	}

	// English is the default because THE US RULES THE WORLD USA! USA! USA!
	if (digit > 3 && digit < 21) return 'th';
	switch (digit % 10) {
		case 1: return 'st';
		case 2: return 'nd';
		case 3: return 'rd';
		default: return 'th';
	}
};

export default addZero;