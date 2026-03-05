<script lang='ts'>

	import { resolve } from '$app/paths';
	let {row, column} = $props();

	let linkUrl = $derived(column.linkFunction(row));
	let linkClass = $state('');

	let tournName = $derived.by( () => {
		let returnName = '';

		// Highlight the national tournaments
		if (row.special?.split(',').includes('ncfl', 'nsda_nats', 'nsda_ms_nats')) {
			linkClass += 'font-semibold';
		}

		if (row.weekendId) {
			returnName = '<div class="w-full flex">';
			returnName += '<span class="font-semibold w-1/2 pe-1 flex-wrap whitespace-normal">NSDA ';
			returnName += row.name.replace(' District Tournament', '');
			returnName += '</span><span class="w-1/2 px-1 flex-wrap whitespace-normal">';
			returnName += row.weekendName;
			returnName += '</span></div>';
		}

		return returnName || row.name;
	});

</script>
	<a
		class = 'text-primary-800 underline decoration-dotted decoration-primary-400 hover:text-primary-600 hover:decoration-solid {linkClass}'
		href  = {resolve(linkUrl)}
	>{@html tournName}</a>