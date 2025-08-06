import { writable } from 'svelte/store';

export const reactiveQueryArgs = <T>(cb: () => T) => {

	console.log(`I am called`);
	const store = writable<T>();

	$effect.pre(() => {
		store.set(cb());
	});

	return store;
};