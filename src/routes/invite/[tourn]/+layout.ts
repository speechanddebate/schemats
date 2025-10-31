interface tournPathParams {
	tourn: string,
}

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export const load = async ({ params }: { params: tournPathParams }) => {

	const tournId:number = parseInt(params.tourn) || 0;
	const webname:string = params.tourn;

	let queryUrl = '';

	if (tournId) {
		return { tournId };
	} else if (webname) {
		try {
			queryUrl = `${import.meta.env.VITE_API_URL}/public/invite/${webname}`;
			const response = await fetch(queryUrl, { credentials: 'include' });
			const tourndata = await response.json();
			return {tournId: tourndata.tourn.id || 0 };
		} catch (err) {
			return {error: err};
		}
	}
};