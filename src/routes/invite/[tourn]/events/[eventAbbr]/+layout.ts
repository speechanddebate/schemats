interface eventPathParams {
	eventAbbr : string,
	tourn     : string,
}

export const load = async ({ params }: { params: eventPathParams }) => {
	const queryUrl = `${import.meta.env.VITE_API_URL}/public/invite/webname/${params.tourn}/events/${params.eventAbbr}`;
	const response = await fetch(queryUrl, { credentials: 'include' });
	return await response.json();
};
