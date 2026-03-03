import { createContext } from 'svelte';

type User = {
	id: number;
	name: string;
	email: string;
	tz: string;
}

type UserState = {
	current: User | null;
}

const [getUserState, setUserState] = createContext<UserState>();

export function initUserContext(initialUser: User | null = null) {
	const state = $state<UserState>({ current: initialUser });
	setUserState(state);
	return state;
}

export function getUserContext() {
	const state = getUserState();
	return state.current;
}

export function useIsAuthenticated() {
	const state = getUserState();
	return !!state.current;
}