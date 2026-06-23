<script lang="ts" module>
	import IconButton from '$lib/components/IconButton.svelte';
	import {
		Check,
	} from '@lucide/svelte';

	import { defineMeta } from '@storybook/addon-svelte-csf';

const { Story } = defineMeta({
	title: 'Components/IconButton',
});

</script>

<Story name="Icon Buttons">
Outline Buttons
<div class="flex space-x-2">
	<IconButton label="Check" variant="outline"><Check/></IconButton>
	<IconButton color="red" label="Red" variant="outline"><Check/></IconButton>
	<IconButton color="green" label="Green" variant="outline"><Check/></IconButton>
	<IconButton color="blue" label="Blue" variant="outline"><Check/></IconButton>
	<IconButton color="purple" label="Purple" variant="outline"><Check/></IconButton>
</div>
Solid Buttons
<div class="flex space-x-2">
	<IconButton label="Check" variant="solid"><Check/></IconButton>
	<IconButton color="red" label="Red" variant="solid"><Check/></IconButton>
	<IconButton color="green" label="Green" variant="solid"><Check/></IconButton>
	<IconButton color="blue" label="Blue" variant="solid"><Check/></IconButton>
	<IconButton color="purple" label="Purple" variant="solid"><Check/></IconButton>
</div>

</Story>

