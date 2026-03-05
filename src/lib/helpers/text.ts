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

export default addZero;