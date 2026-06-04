<script lang="ts">
import { createRestCircuitsActive } from '$indexcards';
import { handleOrval } from '$lib/helpers/query';
import CircuitsTable from '$lib/components/tables/circuitsTable.svelte';

const circuitsQuery = createRestCircuitsActive();
const circuitsData = $derived(handleOrval(circuitsQuery));

</script>
<div>
	<CircuitsTable {circuitsData}/>
</div>
