import config from '$config';

interface eventPathParams {
	eventAbbr : string,
	tourn     : string,
}

export const load = async ({ params }: { params: eventPathParams }) => {
	const queryUrl = `${config.indexcards.basePath}/public/invite/webname/${params.tourn}/events/${params.eventAbbr}`;
	const response = await fetch(queryUrl, { credentials: 'include' });
	return await response.json();
};
