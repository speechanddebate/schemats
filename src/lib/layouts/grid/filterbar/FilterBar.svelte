<script>
	import { Locale } from '@svar-ui/svelte-core';
	import { en } from '@svar-ui/filter-locales';
	import Layout from './Layout.svelte';

	let { ...props } = $props();
</script>

<Locale
	optional = {true}
	words    = {en}
>
	<Layout {...props} />
</Locale>
