import { describe, it, expect } from 'vitest';
import { showDateTime, getWeek } from '$lib/helpers/dt';
describe('showDateTime', () => {
	it('does not throw on undefined input', () => {
		expect(() => showDateTime({ dt: undefined })).not.toThrow();
	});
});
describe('getWeek', () => {
	it('calculates the correct week number', () => {
		//wrote these tests based on the current implementation 
		const date = new Date('2024-01-01'); // January 1, 2024 is a Monday
		expect(getWeek(date)).toBe(52); // Should be in the last week of the previous year

		const date2 = new Date('2024-01-07'); // January 7, 2024 is a Sunday
		expect(getWeek(date2)).toBe(1); // Should be in the first week of the year

		const date3 = new Date('2024-01-08'); // January 8, 2024 is a Monday
		expect(getWeek(date3)).toBe(1); // Should be in the first week of the year
	});
});