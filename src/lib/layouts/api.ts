import { indexcardsApiBaseUrl } from '$indexcards/runtime';
import type { Session } from '$lib/types/user.ts';

export const sessionApi = (customFetch = fetch) => ({

	getSession: async () => {

		const response = await customFetch(
			`${indexcardsApiBaseUrl()}/user/session`,
			{
				credentials: 'include',
			}
		);

		const data = (await response.json()) as Session;
		return data;
	},
});