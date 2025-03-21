import type { Session } from '$lib/types/user.ts';

export const authApi = (customFetch = fetch) => ({
	getSession: async () => {

		const response = await customFetch(
			`${import.meta.env.VITE_API_URL}/user/session`,
			{
				credentials: 'include',
			}
		);
		const data = (await response.json()) as Session;
		return data;
	},
});