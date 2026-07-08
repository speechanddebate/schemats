import { attachCSRFToken } from './utils';

describe('attachCSRFToken', () => {
	const CSRF_HEADER = 'X-CSRF-Token';
	const CSRF_TOKEN = 'test-csrf-token';

	it('attaches CSRF token for mutation methods', () => {
		const mutationMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
		for (const method of mutationMethods) {
			const headers = new Headers();
			attachCSRFToken(headers, method, () => CSRF_TOKEN, CSRF_HEADER);
			expect(headers.get(CSRF_HEADER)).toBe(CSRF_TOKEN);
		}
	});

	it('does not attach CSRF token for GET/HEAD', () => {
		const headers = new Headers();
		attachCSRFToken(headers, 'GET', () => CSRF_TOKEN, CSRF_HEADER);
		expect(headers.get(CSRF_HEADER)).toBeNull();
		attachCSRFToken(headers, 'HEAD', () => CSRF_TOKEN, CSRF_HEADER);
		expect(headers.get(CSRF_HEADER)).toBeNull();
	});

	it('does not attach if token is missing', () => {
		const headers = new Headers();
		attachCSRFToken(headers, 'POST', () => undefined, CSRF_HEADER);
		expect(headers.get(CSRF_HEADER)).toBeNull();
	});

	it('does not overwrite an existing CSRF header', () => {
		const headers = new Headers({ [CSRF_HEADER]: 'already-set' });
		attachCSRFToken(headers, 'POST', () => CSRF_TOKEN, CSRF_HEADER);
		expect(headers.get(CSRF_HEADER)).toBe('already-set');
	});
});