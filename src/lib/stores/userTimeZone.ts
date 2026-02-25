import { writable } from 'svelte/store';

// Default to UTC and en-US if not in browser
const defaultTimeZone = 'UTC';
const defaultLocale = 'en-US';

function detectUserTimeZone() {
	if (typeof window !== 'undefined' && typeof Intl !== 'undefined') {
		return Intl.DateTimeFormat().resolvedOptions().timeZone || defaultTimeZone;
	}
	return defaultTimeZone;
}

function detectUserLocale() {
	if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
		return navigator.language || defaultLocale;
	}
	return defaultLocale;
}

export const userTimeZone = writable(detectUserTimeZone());
export const userLocale = writable(detectUserLocale());

// Optionally, update on mount in case of hydration
export function updateUserTimeZoneAndLocale() {
	userTimeZone.set(detectUserTimeZone());
	userLocale.set(detectUserLocale());
}
