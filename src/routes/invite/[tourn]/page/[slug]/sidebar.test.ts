import {render} from '@testing-library/svelte';
import Sidebar from './sidebar.svelte';

it('Does not crash with no props', () => {
	expect(() => render(Sidebar, {})).not.toThrow();
});