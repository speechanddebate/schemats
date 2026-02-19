<script lang='ts'>
	/* eslint-disable svelte/no-navigation-without-resolve */
	// A component to show a sidebar link with standard formatting

	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	let input = $props();

</script>

	{#if input.mailto}
		<a
			class = 'blue full bg-back-100 text-xs
				border-s-2 border-primary-400
				border-y-1 border-y-back-300
				hover:bg-secondary-100
				${ input.linkClass }
			'
			href = 'mailto:{ input.email }'
		>
			{input.linkText || `Email ${input.email}` }
		</a>
	{:else if input.url}
		<a
			class = 'blue full bg-back-100 text-xs
				border-s-2 border-primary-400
				border-y-1 border-y-back-300
				hover:bg-secondary-100
				${ input.linkClass }
			'
			href = '{input.url}'
		>
			{input.linkText || input.url }
		</a>
	{:else if input.location}
		<a
			class = '
				{ page.url.pathname === input.location
					? 'bg-primary-700 text-secondary-200 hover:text-black hover:bg-secondary-300'
					: 'bg-back-100 text-black'
				}
				blue full bg-back-100 text-xs
				border-s-2 border-primary-400
				border-y-1 border-y-back-300
				hover:bg-secondary-100
				${ input.linkClass }
			'
			href = {resolve(input.location)}
		>
			{input.linkText || input.location }
		</a>
	{/if}