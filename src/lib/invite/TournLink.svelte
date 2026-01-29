<script lang='ts'>

	import { resolve } from '$app/paths';
	let {row, column} = $props();

	let linkUrl = $derived(column.linkFunction(row));
	let linkClass = $state('');

	let tournName = $derived.by( () => {
		let returnName = '';

		// Highlight the national tournaments
		['nsda-nats', 'nsda-msnats', 'ncfl'].forEach( (tag) => {
			if (row[tag]) {
				linkClass += 'font-semibold';
			}
		});

		if (row.districts) {
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
		class = 'hover:text-primary-700 hover:text-decoration-line {linkClass}'
		href  = {resolve(linkUrl)}
	>{@html tournName}</a>