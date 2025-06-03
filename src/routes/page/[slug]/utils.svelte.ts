
export const reactiveQueryArgs = <T>(cb: () => T) => {

	const store = writable<T>();

	$effect.pre(() => {
		store.set(cb());
	});

	console.log(store);

	return store;
};