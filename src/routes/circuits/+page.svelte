<script lang="ts">
import { createRestCircuitsActive } from '$indexcards';
import { safeExtract } from '$lib/helpers/query';
import CircuitsTable from '$lib/components/tables/circuitsTable.svelte';

const circuitsQuery = createRestCircuitsActive();

const circuitsData = $derived(safeExtract(circuitsQuery));

</script>
<div>
	<CircuitsTable {circuitsData}/>
</div>
