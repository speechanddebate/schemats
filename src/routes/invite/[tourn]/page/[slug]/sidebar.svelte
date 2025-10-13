<script lang='ts'>

	import Sidebar from '$lib/layouts/Sidebar.svelte';
	import ShowDateRange from '$lib/layouts/ShowDateRange.svelte';

	import { ucfirst } from '$lib/helpers/text';

	import { resolve } from '$app/paths';
	import { page } from '$app/state';

	let {
		tourn,
		contacts = [],
		pages    = [],
	} = $props();

</script>

	<Sidebar >
		<div class="sidenote">
			<h5 class='my-0 border-b-1 border-secondary-500 pb-0 leading-8 mb-2'>
				Location
			</h5>

			<p class='text-sm mb-0 pb-2'>
				{ tourn.city },
				{ tourn.state || tourn.country }
			</p>

			<h5 class='my-0 border-b-1 border-secondary-500 pb-0 leading-8 mb-2'>
				Dates
			</h5>

			<ShowDateRange
				dateClass  = 'text-sm block pb-2'
				divClass   = 'w-full ps-1'
				dtEndISO   = { tourn.end }
				dtStartISO = { tourn.start }
				format     = 'medday'
				mode       = 'date'
				showTz     = { true }
				timeClass  = 'italic text-xs block'
				tz         = { tourn.tz }
			/>

			<h5 class='my-0'>
				Contacts
			</h5>

			{#if contacts && contacts.length > 0}
				{#each contacts as contact (contact.email)}
					<a
						class = 'blue full bg-back-100 text-xs
							border-s-2 border-primary-400
							border-y-1 border-y-back-300
							hover:bg-secondary-100
						'
						href = 'mailto:{ contact.email }'
					>
						{contact.first}
						{contact.middle}
						{contact.last}
					</a>
				{/each}
			{/if}

			{#if (pages && pages.length > 1)}
				<h4>Additional Information</h4>
				{#each pages as webpage (webpage.id)}
					{#if webpage.special !== 'main'}
						<a
							class = '
								{ page.url.pathname === `/invite/${tourn.webname}/page/${webpage.id}`
									? 'bg-primary-700 text-secondary-200 hover:text-black hover:bg-secondary-300'
									: 'bg-back-100 text-black'
								}
								blue full bg-back-100 text-xs
								border-s-2 border-primary-800
								border-y-1 border-y-back-300
								hover:bg-secondary-100
								'
							href = {resolve(`/invite/${tourn.webname}/page/${webpage.id}`, {} )}
						>
							{ucfirst(webpage.title)}
						</a>
					{/if}
				{/each}
			{/if}
		</div>
	</Sidebar>