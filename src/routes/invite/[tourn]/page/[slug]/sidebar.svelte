<script lang='ts'>

	import Sidebar from '$lib/layouts/Sidebar.svelte';
	import ShowDateRange from '$lib/layouts/ShowDateRange.svelte';
	import { shortZone } from '$lib/helpers/dt';

	import { ucfirst } from '$lib/helpers/text';
    import SideLink from '$lib/layouts/SideLink.svelte';

	let {
		tourn,
		contacts = [],
		webpages = [],
	} = $props();

	let locationState = $derived.by( () => {
		if (tourn.inPerson > 0 && tourn.state || tourn.country) {
			return tourn.state || tourn.country;
		}
		if (tourn.tz) {
			return shortZone(tourn.tz);
		}
		return 'UTC';
	});

</script>

	<Sidebar >
		<div class="sidenote">
			<h5 class='my-0 border-b-1 border-secondary-500 pb-0 leading-8 mb-2'>
				Location
			</h5>

			<p class='text-sm mb-0 pb-2'>
				{ tourn.city }, { locationState }
			</p>

			<h5 class='my-0 border-b-1 border-secondary-500 pb-0 leading-8 mb-0'>
				Dates
			</h5>

			<ShowDateRange
				dateClass = 'text-xs py-1 ps-1 flex'
				endISO    = { tourn.end }
				format    = 'medday'
				mode      = 'date'
				showTz    = { true }
				spanClass = 'w-full py-1 inline-block flexgrow'
				startISO  = { tourn.start }
				tz        = { tourn.tz }
			/>

			<h5 class='my-0'>
				Contacts
			</h5>

			{#if contacts && contacts.length > 0}
				{#each contacts as contact (contact.email)}
					<SideLink
						linkText={`${contact.first} ${contact.last}`}
						mailto={ contact.email }
					/>
				{/each}
			{/if}

			{#if (webpages && webpages.length > 1)}
				<h4>Additional Information</h4>
				{#each webpages as webpage (webpage.id)}
					{#if webpage.special === 'main'}
						<SideLink
							linkText={ucfirst(webpage.title)}
							location={`/invite/${tourn.webname}`}
						/>
					{:else}
						<SideLink
							linkText={ucfirst(webpage.title)}
							location={`/invite/${tourn.webname}/page/${webpage.id}`}
						/>
					{/if}
				{/each}
			{/if}
		</div>
	</Sidebar>
