import type { LayoutLoad } from './$types';
import { userChapters } from '$indexcards';
import type { UserChapter } from '$indexcards/schemas';
export const load: LayoutLoad = async ({ fetch }) => {
	const res = await userChapters({},fetch);
	let chapters: UserChapter[] = [];
	if(res.status === 200)
		chapters = res.data;
	return { chapters };
};
