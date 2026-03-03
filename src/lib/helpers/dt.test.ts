import { describe, it, expect } from 'vitest';
import { showDateTime } from '$lib/helpers/dt';
describe('showDateTime', () => {
	it('does not throw on undefined input', () => {
		expect(() => showDateTime({ dt: undefined })).not.toThrow();
	});
});