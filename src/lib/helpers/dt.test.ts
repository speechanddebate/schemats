import { showDateTime, getWeek } from '$lib/helpers/dt';
describe('showDateTime', () => {
	it('does not throw on undefined input', () => {
		expect(() => showDateTime({ dt: undefined })).not.toThrow();
	});
});
describe('getWeek', () => {
	it('calculates the correct ISO week number', () => {
		expect(getWeek(new Date('2024-01-01'))).toBe(1); // Monday in ISO week 1
		expect(getWeek(new Date('2024-01-07'))).toBe(1); // Sunday in ISO week 1
		expect(getWeek(new Date('2024-01-10'))).toBe(2); // Wednesday in ISO week 2
		expect(getWeek(new Date('2021-01-01'))).toBe(53); // Belongs to ISO week 53 of 2020
		expect(getWeek(new Date('2024-12-31'))).toBe(1); // Belongs to ISO week 1 of 2025
	});
});
