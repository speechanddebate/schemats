import '@testing-library/jest-dom/vitest';
import { vi } from 'vitest';
Object.defineProperty(window, 'matchMedia', {
	writable: true,
	value: vi.fn().mockImplementation(query => ({
	  matches: false,
	  media: query,
	  onchange: null,
	  addListener: vi.fn(), // Deprecated
	  removeListener: vi.fn(), // Deprecated
	  addEventListener: vi.fn(),
	  removeEventListener: vi.fn(),
	  dispatchEvent: vi.fn(),
	})),
  });
Object.defineProperty(window, 'ResizeObserver', {
	writable: true,
	value: class {
		observe = vi.fn();
		unobserve = vi.fn();
		disconnect = vi.fn();
	},
});
