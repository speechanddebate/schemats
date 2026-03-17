<script lang="ts">
import { createRestCircuitsActive } from '$indexcards';
import { safeExtract } from '$lib/helpers/query';

const circuitsQuery = createRestCircuitsActive();

const circuitsData = $derived(safeExtract(circuitsQuery));

</script>

This is a page for displaying a list of active circuits
Circuits: {circuitsData?.length}
{#each circuitsData as circuit (circuit.id)}
	<p><a href="circuits/{circuit.id}/calendar">id:{circuit.id}
		abbr:{circuit.abbr}
		name:{circuit.name}
		state:{circuit.state}
		country:{circuit.country}
		tournCount:{circuit.tournCount}</a></p>
{/each}