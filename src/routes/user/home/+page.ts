import { redirect } from '@sveltejs/kit';

export function load() {
	throw redirect(302, 'https://www.tabroom.com/user/setup.mhtml');
}