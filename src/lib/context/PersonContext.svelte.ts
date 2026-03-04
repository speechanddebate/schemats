import { createContext } from 'svelte';

type Person = {
	id: number;
	name: string;
	email: string;
	tz: string;
}

type PersonState = {
	current: Person | null;
}

const [getPersonState, setPersonState] = createContext<PersonState>();

export function initPersonContext(initialPerson: Person | null = null) {
	const state = $state<PersonState>({ current: initialPerson });
	setPersonState(state);
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