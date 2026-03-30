import type { Session } from '$indexcards';
// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Error {
			errorId: string;
		}
		interface Locals {
			requestId: string;
			Session: Session;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
