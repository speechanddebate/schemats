interface NSDACategory {
	code: string,
	name: string,
};

import config from '$config';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({fetch}) => {

	const codesUrl = `${config.indexcards.host}${config.indexcards.basePath}/pages/invite/nsdaCategories`;

	const response = await fetch(codesUrl, { credentials: 'include' });
	const codes = await response.json();

	const data = {
		NSDACategories: Array<NSDACategory>,
	};

	data.NSDACategories = codes.map( (code:NSDACategory) =>  code.name );
	return data;
};

export  const ssr = false;