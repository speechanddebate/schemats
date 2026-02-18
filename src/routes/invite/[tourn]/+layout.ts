interface tournPathParams {
	tourn: string,
}

export const load = async ({ params }: { params: tournPathParams }) => {
	const queryUrl = `${import.meta.env.VITE_API_URL}/pages/invite/webname/${params.tourn}`;
	const response = await fetch(queryUrl, { credentials: 'include' });
	return await response.json();
};