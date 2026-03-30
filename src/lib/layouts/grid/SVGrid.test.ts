import {render} from '@testing-library/svelte';
import SVGrid from './SVGrid.svelte';

//the component should not crash with an empty data set
it('Does not crash with no props', () => {
	expect(() => render(SVGrid, {data: [], columns: [{
		id: 'id',
		hidden: true,
	}]})).not.toThrow();
});
