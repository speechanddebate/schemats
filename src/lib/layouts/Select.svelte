<script lang='ts'>

    import Select from 'svelte-select-5';

	let {
		items,
		startId,
		options,
		selectedId   = $bindable(),
		selectedItem = $bindable(),
	} = $props();

	let inputStyles = $derived(options.inputStyles || 'inputStyles="box-sizing: border-box;"');
	let listHeight = $derived(options.listHeight || '54vh');
	let border  = $derived(options.border || '1px solid var(--color-primary-500)');

</script>

	<Select
		--border                  = {border}
		--chevron-height          = '24px'
		--font-size               = '13px'
		--height                  = '32px'
		--item-height             = '24px'
		--item-line-height        = '24px'
		--item-padding            = '0 4px 0 4px'
		--list-max-height         = { listHeight }
		--padding                 = '0 4px 0 4px'
		--value-container-padding = '0 0 0 2px'

		clearable          = { options?.clearable || false}
		inputStyles        = {inputStyles}
		items              = {items}
		onchange           = { options?.onChange || options.onchange }
		showChevron        = { options?.showChevron || true}
		startId            = {startId || undefined}
		bind:selectedId    = {selectedId}
		bind:selectedValue = {selectedItem}
	/>
