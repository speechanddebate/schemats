<script lang='ts'>

	import { DateTime } from 'luxon';
	import { type DateTime as DTInput } from 'luxon';
    import { showDateTime, showDate, showTime } from '$lib/helpers/dt';

	interface HopperType {
		regStart?       : DTInput,
		regEnd?         : DTInput,
		regStartDate?   : string | undefined,
		regEndDate?     : string | undefined,
		regStartTime?   : string | undefined,
		regEndTime?     : string | undefined,
		regEndDateTime? : string | undefined,
		tag?            : string,
		tip?            : string,
		text?           : string,
	}

	// Component to display the registration status on the main page.
	let { row } = $props();

	let status = $derived.by( () => {

		const hopper:HopperType = { };

		hopper.regStart = DateTime.fromISO(row.regStart);
		hopper.regEnd   = DateTime.fromISO(row.regEnd);

		hopper.regStartDate = showDate({
			dtISO   : row.regStart,
			tz     : row.tz,
			format : 'short',
		});

		hopper.regStartTime = showTime({
			dtISO   : row.regStart,
			tz     : row.tz,
			format : 'short',
		});

		hopper.regEndDate = showDate({
			dtISO  : row.regEnd,
			tz     : row.tz,
			format : 'short',
		});

		hopper.regEndDateTime = showDateTime({
			dtISO    : row.regEnd,
			tz       : row.tz,
			showTz   : true,
			joinWord : 'at',
		});

		hopper.regEndTime = showTime({
			dtISO  : row.regEnd,
			tz     : row.tz,
			format : 'short',
			showTz : false,
		});

		hopper.tag  = 'beatsme';
		hopper.tip  = 'Registration Status Unknown';
		hopper.text = 'Registration Status Unknown';

		if (row.special?.split(',').includes('closed_entry')) {
			hopper.tag  = 'admin';
			hopper.text = 'Admin Only';
			hopper.tip  = 'Tournament Administrators will register all entries.';
		} else if (hopper.regEnd < DateTime.now()) {
			hopper.tag  = 'over';
			hopper.text = 'Closed';
			hopper.tip  = `Registration was due on ${ hopper.regEndDate } `;
		} else if (hopper.regStart > DateTime.now()) {
			hopper.tag  = 'notyet';
			hopper.text = 'Opens';
			hopper.tip  = `Registration will open ${ hopper.regStartDate } and is due on ${ hopper.regEndDate} `;
		} else {
			hopper.tag  = 'open';
			hopper.text = `Due by`;
			hopper.tip  = `Registration is open and is due on ${ hopper.regEndDateTime}`;
		}
		return hopper;
	});

</script>

	<div
		class='flex w-full text-center justify-around m-0'
		title='{status.tip}'
	>

		{#if status.tag === 'admin'}

			<span class='text-error-600 w-full'>
				{status.text}
			</span>

		{:else if status.tag === 'over'}

			<span class='text-error-600 w-full'>
				{status.text}
			</span>

		{:else if status.tag === 'notyet'}

			<span class='text-primary-600 font-semibold w-1/3'>
				{status.text}
			</span>
			<span class='w-1/3'>
				{status.regStartDate}
			</span>
			<span class='w-1/3'>
				{status.regStartTime}
			</span>

		{:else if status.tag === 'open'}

			<span class='text-success-600 font-semibold w-1/3'>
				{status.text}
			</span>
			<span class='w-1/3'>
				{status.regEndDate}
			</span>
			<span class='w-1/3'>
				{status.regEndTime}
			</span>

		{:else}

			{status.text}

		{/if}

	</div>