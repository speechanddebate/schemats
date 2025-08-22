import { writable } from 'svelte/store';
import { createQuery } from '@tanstack/svelte-query';

interface queryData {
	path     : string | undefined,
	key?     : string | number,
	options? : { [key:string] : string | number | boolean },
};

// Finally found a pattern of querying that mostly works for my very deranged
// brain.

export const idxQuery = ( params:queryData ) => {

	const { path, key, options } = params;

	let queryUrl = `${path}`;

	if (key) {
		queryUrl += `/${key}`;
	}

	let notFirst;

	if (options) {
		queryUrl += '?';
		for (const parameter in options) {
			if (notFirst) {
				queryUrl += '&';
			}
			queryUrl += `${parameter}=${options[parameter]}`;
		}
		notFirst = true;
	}

	const response = createQuery({
		queryKey: ['args', key],
		queryFn: async () => {
			try {
				const response = await fetch(`${import.meta.env.VITE_API_URL}/${queryUrl}`);
				return response.json();
			} catch (err) {
				return {error: err};
			}
		},
	});

	return response;
};

export const reactiveQueryArgs = <T>(cb: () => T) => {
	const store = writable<T>();

	console.log(`CB inbound is ${cb} and the output is`);
	console.log(cb());

	$effect.pre(() => {
		store.set(cb());
	});

	return store;
};