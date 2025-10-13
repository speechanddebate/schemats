export const addZero = (i:number):string => {
	if (i < 10) {
		const paddedString:string = `0${i}`;
		return paddedString;
	}
	return i.toString();
};

export const ucfirst = (lowered:string) => {
	if (lowered) {
		return String(lowered).charAt(0).toUpperCase() + String(lowered).slice(1);
	}
};

export default addZero;