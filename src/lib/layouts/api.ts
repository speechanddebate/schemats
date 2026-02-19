import type { Session } from '$lib/types/user.ts';
import config from '$config';

export const sessionApi = (customFetch = fetch) => ({

	getSession: async () => {

		const response = await customFetch(
			`${config.indexcards.basePath}/user/session`,
			{
				credentials: 'include',
			}
		);

		const data = (await response.json()) as Session;
		return data;
	},
});