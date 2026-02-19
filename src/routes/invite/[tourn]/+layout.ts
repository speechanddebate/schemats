import config from '$config';

interface tournPathParams {
	tourn: string,
}

export const load = async ({ params }: { params: tournPathParams }) => {
	const queryUrl = `${config.indexcards.basePath}/pages/invite/webname/${params.tourn}`;
	const response = await fetch(queryUrl, { credentials: 'include' });
	return await response.json();
};