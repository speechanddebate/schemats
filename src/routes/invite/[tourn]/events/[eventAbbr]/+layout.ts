interface eventPathParams {
	eventAbbr : string,
	tourn     : string,
}

export const load = async ({ params }: { params: eventPathParams }) => {
	const tournQueryUrl = `${import.meta.env.VITE_API_URL}/pages/invite/webname/${params.tourn}`;
	const tournResponse = await fetch(tournQueryUrl, { credentials: 'include' });
	const tourn = await tournResponse.json();

	const eventQueryUrl = `${import.meta.env.VITE_API_URL}/rest/tourns/${tourn.tournId}/events/${params.eventAbbr}`;
	const eventResponse = await fetch(eventQueryUrl, { credentials: 'include' });
	const event = await eventResponse.json();

	return event;

};
