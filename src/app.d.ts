// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces

import type { Problem } from '$indexcards/schemas/problem';

declare global {
	namespace App {
		interface Error {
			message: string;
			problem?: Problem;
		}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
