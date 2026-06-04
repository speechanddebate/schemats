<script lang='ts'>

	import { resolve } from '$app/paths';
	let { row, column } = $props();

	let linkUrl = $derived.by( () => {
		if (row.Entry?.id) {
			return `/invite/${column.key}/entries/${ row.Entry.id }`;
		}
		return false;
	});

	let linkNames = $derived.by( () => {
		if (row.Student) {
			return {
				name: `${row.Student.first} ${row.Student.last}`,
				hover: `${row.Entry?.code} ${row.School?.name}`,
			};

		} else if (row.Entry) {
			return {
				name: `${row.Entry.code}`,
				hover: `${row.Entry.name} ${row.School?.name}`,
			};

		} else if (row.School) {
			return {
				name : `${row.School.code} ${row.School.name}`,
			};
		}
		return;
	});

</script>

	{#if linkUrl}
		<a
			class = 'hover:text-primary-700 hover:text-decoration-line text-neutral-900
				break-normal font-normal w-full py-1 ps-2 my-0'
			href  = {resolve(linkUrl,{})}
			title = '{ linkNames?.hover }'
		>{linkNames?.name}</a>
	{:else }
		<span
			class = 'text-neutral-900 break-normal font-normal'
		>{row.entityName }</span>
	{/if}
