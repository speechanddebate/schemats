<script lang='ts'>

	// eslint-disable svelte/no-unused-svelte-ignore

	// A component to show the input date in various formatting.  I hopefully
	// will never have the Date() module show up anywhere but here, the ranger
	// and the helper, so when Temporal is ready for prime time I can just rip
	// it through this.

	import { showDate, showDateTime, showTime } from '$lib/helpers/dt';
	import type { DtProps } from '$lib/types/dt';

	let showDtProps:DtProps = $props();

	let formattedDate:string = $derived.by( () => {
		// The helper function does not have access to the system timezone, so
		// translate it within a svelte component.

		if (showDtProps.tz === 'system') {
			showDtProps.tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
		}

		if (showDtProps.mode == 'time') {
			return showTime(showDtProps);
		} else if (showDtProps.mode === 'date') {
			return showDate(showDtProps);
		}
		return showDateTime(showDtProps);
	});

</script>

	<span class="${showDtProps.spanClass}">
		{ formattedDate }
	</span>