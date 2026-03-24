import { createContext } from 'svelte';
import type { Session, Person } from '$indexcards/schemas';

type SessionState = {
	Person: Person | null;
	Su?: Person | null;
}

const [getSessionState, setSessionState] = createContext<SessionState>();

function toSessionState(session: Session | null): SessionState {
	if (!session) {
		return { Person: null };
	}
	return { Person: session.Person ?? null, Su: session.Su };
}

export function initSessionContext(getSession: () => Session | null) {
	const state = $state<SessionState>(toSessionState(getSession()));
	setSessionState(state);

	$effect(() => {
		const session = getSession();
		const nextState = toSessionState(session);
		state.Person = nextState.Person;
		state.Su = nextState.Su;
	});

	return state;
}
/**
 * Returns the current "active" person, if this is an Su session, this will be the impersonated user
 */
export function getActivePerson() {
	const state = getSessionState();

	return state.Su ?? state.Person;
}
/**
 * Returns the root person of the session, this will always be the authenticated person.
 */
export function getRootPerson() {
	const state = getSessionState();
	return state.Person;
}

export function isAuthenticated() {
	const state = getSessionState();
	return !!(state.Su ?? state.Person);
}
export function isSuSession() {
	const state = getSessionState();
	return !!state.Su;
}