import type { PageLoad } from './$types';
import grab from 'grab-url';

interface NSDACategory {
	code: string;
	name: string;
}

export const load: PageLoad = async () => {
	// Calling grab without leading slash to match the updated mock keys
	const codes = await grab<NSDACategory[]>('pages/invite/nsdaCategories');

	const data = {
		NSDACategories: [] as string[]
	};

	if (Array.isArray(codes)) {
		data.NSDACategories = codes.map((code: NSDACategory) => code.name);
	} else {
		console.error('Expected array from nsdaCategories, got:', codes);
	}
	
	return data;
};

export const ssr = false;