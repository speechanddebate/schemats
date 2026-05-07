import config from '../../config/config';
import { attachCSRFToken } from './utils';

describe('attachCSRFToken', () => {
	const CSRF_HEADER = config.indexcards.csrfTokenHeader;
	const CSRF_TOKEN = 'test-csrf-token';

	it('attaches CSRF token for mutation methods', () => {
		const mutationMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
		for (const method of mutationMethods) {
			const headers = new Headers();
			attachCSRFToken(headers, method, () => CSRF_TOKEN);
			expect(headers.get(CSRF_HEADER)).toBe(CSRF_TOKEN);
		}
	});

	it('does not attach CSRF token for GET/HEAD', () => {
		const headers = new Headers();
		attachCSRFToken(headers, 'GET', () => CSRF_TOKEN);
		expect(headers.get(CSRF_HEADER)).toBeNull();
		attachCSRFToken(headers, 'HEAD', () => CSRF_TOKEN);
		expect(headers.get(CSRF_HEADER)).toBeNull();
	});

	it('does not attach if token is missing', () => {
		const headers = new Headers();
		attachCSRFToken(headers, 'POST', () => undefined);
		expect(headers.get(CSRF_HEADER)).toBeNull();
	});

	it('does not overwrite an existing CSRF header', () => {
		const headers = new Headers({ [CSRF_HEADER]: 'already-set' });
		attachCSRFToken(headers, 'POST', () => CSRF_TOKEN);
		expect(headers.get(CSRF_HEADER)).toBe('already-set');
	});
});