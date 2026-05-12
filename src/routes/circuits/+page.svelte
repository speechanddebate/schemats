<script lang="ts">
import { createRestCircuitsActive } from '$indexcards';
import { handleRequest } from '$lib/helpers/query';
import CircuitsTable from '$lib/components/tables/circuitsTable.svelte';

const circuitsQuery = createRestCircuitsActive();

const circuitsData = $derived(handleRequest(circuitsQuery));

</script>
<div>
	<CircuitsTable {circuitsData}/>
</div>
