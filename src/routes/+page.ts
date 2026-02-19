interface NSDAEventCode {
	code: string,
	name: string,
};

export const load = async () => {
	const codesUrl = `${import.meta.env.VITE_API_URL}/pages/invite/nsdaCodes`;
	const response = await fetch(codesUrl, { credentials: 'include' });
	const codes = await response.json();
	const data = {
		NSDAEventCodes: Array<NSDAEventCode>,
	};
	data.NSDAEventCodes = codes.map( (code:NSDAEventCode) =>  code.name );
	return data;
};
