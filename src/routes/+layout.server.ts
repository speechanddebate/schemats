
// Find and deliver the Tabroom cookie

export const load = ( async ({ cookies }) => {

	const sessionKey = cookies.get(import.meta.env.VITE_COOKIE_NAME);
	let session = {};

	if (sessionKey) {

		const res = await fetch(
			`${import.meta.env.VITE_API_URL}/user/session`,
			{
				method      : 'POST',
				body        : JSON.stringify({ sessionKey }),
				credentials : 'include',
				headers: {
					'content-type': 'application/json',
					'x-tabroom-cookie': sessionKey,
				},
			}
		);

		session = await res.json();
		if (typeof session === 'string') {
			session = {
				status: false,
				message : session,
			};
		}
	}

	return session;

});
