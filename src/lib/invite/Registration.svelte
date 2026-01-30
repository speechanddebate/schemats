<script lang='ts'>

	import { DateTime } from 'luxon';
    import { showDateTime } from '$lib/helpers/dt';

	// Component to display the registration status on the main page.
	let { row } = $props();

	let status = $derived.by( () => {

		const regStart = DateTime.fromISO(row.reg_start);
		const regEnd   = DateTime.fromISO(row.reg_end);

		const regStartString = showDateTime({
			date : row.reg_start,
			tz   : row.tz,
		});

		const regEndString = showDateTime({
			date : row.reg_end,
			tz   : row.tz,
		});

		let tag     = 'beatsme';
		let statusTip  = 'Registration Status Unknown';
		let statusText = 'Registration Status Unknown';

		if (row.closed) {
			tag        = 'admin';
			statusText = 'Admin Only'
			statusTip  = 'Tournament Administrators will register all entries.';
		} else if (regEnd < DateTime.now()) {
			tag        = 'over';
			statusText = 'Closed'
			statusTip  = `Registration was due on ${ regEndString } `;
		} else if (regStart > DateTime.now()) {
			tag        = 'notyet';
			statusText = `Opens ${ regStartString }`;
			statusTip  = `Registration will open ${ regStartString } and is due on ${ regEndString} `;
		} else {
			tag        = 'open';
			statusText = `Due by ${ regEndString }`;
			statusTip  = `Registration is open and is due by ${ regEndString } `;
		}

		return {
			regStart,
			regEnd,
			tag,
			statusTip,
			statusText,
		};
	});

</script>

	<div class='flex w-full text-center justify-around m-0'>

		{#if status.tag === 'admin'}

			{status.tag}

		{:else if status.tag === 'over'}

			{status.tag}

		{:else if status.tag === 'notyet'}

			{status.tag}

		{:else if status.tag === 'open'}

			{status.tag}

		{:else}

			{status.tag}

		{/if}

	</div>