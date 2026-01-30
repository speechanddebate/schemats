<script lang='ts'>

	let { row } = $props();

	import LaptopCodeSolid from 'flowbite-svelte-icons/LaptopCodeSolid.svelte';
	import UsersSolid from 'flowbite-svelte-icons/UsersSolid.svelte';
	import CodeForkSolid from 'flowbite-svelte-icons/CodeForkSolid.svelte';

</script>

	<div class='flex w-full text-center justify-around m-0'>

		{#if row.in_person}
			<span
				class = "w-1/3 text-primary-600
					hover:bg-primary-600 hover:text-white
					py-1"
				title = "{ row.in_person } event{ row.in_person > 1 ? 's are' : ' is' } in person"
			>
			<UsersSolid
				class = 'm-auto'
				size  = 'xs'
			/>
			</span>
		{/if}

		{#if row.online}
			<span
				class = "
					w-1/3 text-error-500
					hover:bg-error-500 hover:text-white
					py-1"
				title = "{ row.online } event{ row.online > 1 ? 's are' : ' is' } online"
			>
				<LaptopCodeSolid
					class = 'm-auto'
					size  = 'xs'
				/>
			</span>
		{/if}

		{#if row.hybrid}
			<span
				class = "
					w-1/3 text-tertiary-500
					hover:bg-tertiary-500 hover:text-white
					py-1"
				title = "{ row.hybrid } event{ row.hybrid > 1 ? 's are' : ' is' } hybrid"
			>
				<CodeForkSolid
					class = 'm-auto'
					size  = "xs"
				/>
			</span>
		{/if}

	</div>