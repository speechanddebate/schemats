export const addZero = (i:number):string => {
	if (i < 10) {
		const paddedString:string = `0${i}`;
		return paddedString;
	}
	return i.toString();
};
/**
 * Capitalizes the first letter of a string.
 */
export const ucfirst = (lowered:string) => {
	if (lowered) {
		return String(lowered).charAt(0).toUpperCase() + String(lowered).slice(1);
	}
};

export const eventType = (rawType:string) => {
	if (rawType === 'mock_trial') {
		return 'Mock Trial';
	}
	if (rawType === 'wsdc') {
		return 'World Schools';
	}
	if (rawType === 'wudc') {
		return 'British Parliamentary';
	}
	return ucfirst(rawType);
};

export default addZero;