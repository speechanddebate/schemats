import { createContext } from 'svelte';
import type { Person } from '$indexcards/schemas';

type PersonState = {
	current: Person | null;
}

const [getPersonState, setPersonState] = createContext<PersonState>();

export function initPersonContext(getPerson: () => Person | null) {
	const state = $state<PersonState>({ current: getPerson() });
	setPersonState(state);

	$effect(() => {
		state.current = getPerson();
	});

	return state;
}

export function getPersonContext() {
	const state = getPersonState();
	return state.current;
}

export function useIsAuthenticated() {
	const state = getPersonState();
	return !!state.current;
}