<script lang="ts">
	import { indexFetch } from '$lib/indexfetch';
	import Loading from '$lib/layouts/Loading.svelte';

	const circuitsData = indexFetch('/pages/circuits');
</script>

<div class="w-full px-4 ps-8 bg-back-200">
	<div class="main">
		<h3 class="border-b-2 border-primary-600 pb-2 mb-4">Tournament Circuits</h3>

		<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
			{#each [
				{ name: 'National Circuit', abbr: 'NAT', count: 156, desc: 'Major national tournaments including TOC qualifiers and bid tournaments.' },
				{ name: 'Northeast Circuit', abbr: 'NE', count: 89, desc: 'Tournaments across the northeastern United States.' },
				{ name: 'Southeast Circuit', abbr: 'SE', count: 72, desc: 'Regional tournaments in the southeastern states.' },
				{ name: 'Midwest Circuit', abbr: 'MW', count: 64, desc: 'Tournaments throughout the Midwest region.' },
				{ name: 'Western Circuit', abbr: 'W', count: 58, desc: 'Pacific and mountain region tournaments.' },
				{ name: 'Texas Circuit', abbr: 'TX', count: 93, desc: 'The extensive Texas UIL and TFA tournament circuit.' },
				{ name: 'California Circuit', abbr: 'CA', count: 81, desc: 'California state and regional tournaments.' },
				{ name: 'International Circuit', abbr: 'INTL', count: 34, desc: 'Tournaments outside the United States.' },
			] as circuit (circuit.abbr)}
				<div class="border border-back-400 rounded p-4 hover:bg-back-100">
					<div class="flex items-baseline justify-between mb-2">
						<h5 class="m-0">{circuit.name}</h5>
						<span class="text-xs text-back-800 bg-back-300 px-2 py-1 rounded">{circuit.abbr}</span>
					</div>
					<p class="text-sm mb-1">{circuit.desc}</p>
					<p class="text-xs text-back-700 italic">{circuit.count} tournaments this season</p>
				</div>
			{/each}
		</div>
	</div>
</div>
