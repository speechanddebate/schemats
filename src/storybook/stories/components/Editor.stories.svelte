<script lang="ts" module>
	import Editor from '$lib/components/Editor.svelte';
	import { defineMeta } from '@storybook/addon-svelte-csf';

	const { Story } = defineMeta({
		title: 'Components/Editor',
	});
</script>

<script lang="ts">
	let content = $state('<p>Hello World!</p>');
</script>

<Story name="Default">
	<Editor bind:content />

	<div style="margin-top: 20px; padding: 12px; border: 1px solid #ddd; border-radius: 6px; background: #f9f9f9;">
		<h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 600;">Content (HTML):</h3>
		<pre style="margin: 0; white-space: pre-wrap; word-break: break-all; font-size: 12px;">{content}</pre>
	</div>
</Story>