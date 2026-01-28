<script lang='ts'>

	let { row } = $props();

	import LaptopCodeSolid from 'flowbite-svelte-icons/LaptopCodeSolid.svelte';
	import UsersSolid from 'flowbite-svelte-icons/UsersSolid.svelte';
	import CodeForkSolid from 'flowbite-svelte-icons/CodeForkSolid.svelte';

</script>

	<div class='flex w-full text-center justify-around m-0'>

		{#if row.in_person}
			<span
				class = "w-1/3 text-success-600 hover:bg-back-200 p-1"
				title = "{ row.in_person } events are in person"
			>
			<UsersSolid 
				class = 'text-center'
				size  = 'xs'
			/>
			</span>
		{/if}

		{#if row.online}
			<span
				class = "w-1/3 text-warning-400 hover:bg-back-200 p-1"
				title = "{ row.online } events are in person"
			>
				<LaptopCodeSolid
					class = 'text-center'
					size  = 'xs'
				/>
			</span>
		{/if}

		{#if row.hybrid}
			<span
				class = "w-1/3 text-error-500 hover:bg-back-200 p-1"
				title = "{ row.hybrid } events are hybrid (online & in person)"
			>
				<CodeForkSolid
					class = 'text-center'
					size  = "xs"
				/>
			</span>
		{/if}

	</div>