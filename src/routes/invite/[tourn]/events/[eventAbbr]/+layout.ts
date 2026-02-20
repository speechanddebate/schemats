interface eventPathParams {
	eventAbbr : string,
	tourn     : string,
}

export const load = async ({ params }: { params: eventPathParams }) => {

	const urlBase = import.meta.env.VITE_API_URL;

	const tournQueryUrl = `${urlBase}/pages/invite/webname/${params.tourn}`;
	const tournResponse = await fetch(tournQueryUrl, { credentials: 'include' });
	const tourn = await tournResponse.json();

	const eventQueryUrl = `${urlBase}/rest/tourns/${tourn.tournId}/events/byAbbr/${params.eventAbbr}`;
	const eventResponse = await fetch(eventQueryUrl, { credentials: 'include' });
	const event = await eventResponse.json();

	return event;

};
