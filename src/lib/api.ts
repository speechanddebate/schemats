import type { Tournament } from './types/invite.ts';

export const inviteApi = (customFetch = fetch) => ({

	getTournaments: async (limit: number) => {
		const response = await customFetch(
			`${import.meta.env.VITE_API_URL}/public/invite/upcoming?limit=${ limit || 0}`,
		);
		const data = (await response.json()) as Array<Tournament>;
		return data;
	},

	getTournamentsByCircuit: async (circuit: string) => {
		const response = await customFetch(
			`${import.meta.env.VITE_API_URL}/public/invite/upcoming?circuit=${ circuit || 0}`,
		);
		const data = (await response.json()) as Array<Tournament>;
		return data;
	},

	getTournamentsByCountry: async (country: string) => {
		const response = await customFetch(
			`${import.meta.env.VITE_API_URL}/public/invite/upcoming?country=${ country || 0}`,
		);
		const data = (await response.json()) as Array<Tournament>;
		return data;
	},

	getTournamentsByState: async (state: string) => {
		const response = await customFetch(
			`${import.meta.env.VITE_API_URL}/public/invite/upcoming?state=${ state || 0}`,
		);
		const data = (await response.json()) as Array<Tournament>;
		return data;
	},

	getTournamentById: async (id: number): Promise<Tournament> => {
		const response = await customFetch(
			`${import.meta.env.VITE_API_URL}/public/invite/tourn/${id}`,
		);
		const data = (await response.json()) as Tournament;
		return data;
	},
});