import {render} from '@testing-library/svelte';
import SVGrid from './SVGrid.svelte';

it('Does not crash with no props', () => {
	expect(() => render(SVGrid, {data: null, columns: []})).not.toThrow();
});
