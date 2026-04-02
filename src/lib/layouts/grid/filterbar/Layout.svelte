<script>
	// @ts-nocheck
	// eslint-disable @typescript-eslint/no-unused-expressions

	import { getContext, untrack } from 'svelte';
	import {
		RichSelect,
		Text,
		DatePicker,
		DateRangePicker,
	} from '@svar-ui/svelte-core';
	import { createFilterRule } from '@svar-ui/filter-store';

	let { fields = [], debounce = 300, onchange } = $props();

	let lastField = $state(),
		timer = $state(),
		lastValue = $state({});

	const locale = getContext('wx-i18n');
	const l = locale.getRaw();
	const f = l.filter?.dateFormat || l.formats?.dateFormat;
	const _ = locale.getGroup('filter');

	let normalizedFields = $derived(normalizeFields(fields));

	$effect.pre(() => {

		normalizedFields = normalizedFields;

		// prepare lastField and lastValue
		untrack(() => {
			const values = {};
			normalizedFields.forEach(field => {
				if (field.type === 'dynamic') {
					field.by.forEach(fieldby => {
						if (typeof fieldby.value !== 'undefined')
							values[fieldby.id] = fieldby.value;
					});
					lastField = field.by[0]?.id;
				} else if (field.type === 'all') {
					values[field.type] = field.value ?? '';
				} else if (typeof field.value !== 'undefined') {
					values[field.id] = field.value;
				}
			});
			lastValue = values;
		});
	});

	let filters = $derived.by(() => {
		return normalizedFields.map(field => {
			let base = {
				field       : field.type,
				label       : field.label,
				placeholder : field.placeholder,
			};

			if (field.type === 'dynamic') {
				base.dynamicField = true;
				base.field = lastField;

				const currentField = field.by.find(flazy => flazy.id === base.field);
				if (currentField) {
					base = {
						...base,
						...currentField,
					};
				}
			} else if (field.type !== 'all') {
				base = { ...base, ...field, field: field.id };
			}

			if (field.by) base.optionsBy = getDynamicOptions(field.by);
			base.value = lastValue[base.field];

			return { type: 'text', filter: 'contains', ...base };
		});
	});

	function updateValue(value, field, delay) {
		lastValue[field] = value === '$empty' ? '' : value;

		dispatchChange(delay);
	}

	function updateFiltersField(value) {
		if (lastField !== value) {
			if (lastField) {
				lastValue = { ...lastValue, [lastField]: '' };
			}
			lastField = value;
		}

		dispatchChange();
	}

	function dispatchChange(delay) {
		if (timer) clearTimeout(timer);
		timer = setTimeout(() => {
			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			onchange && onchange({ value: getRules() });
		}, delay || debounce);
	}

	function getRules() {
		const rules = filters.map(frule => getRule(frule)).filter(a => !!a);
		if (rules.length === 1 && rules[0]?.glue === 'or') return rules[0];
		return {
			glue: 'and',
			rules,
		};
	}

	function getRule(filter) {
		if (filter.field === 'all')
			return createFilterRule(
				filter.optionsBy,
				'contains',
				lastValue[filter.field]
			);
		const value = lastValue[filter.field];
		if (!value) return null;

		return {
			field: filter.field,
			filter: filter.filter,
			type: filter.type,
			value,
		};
	}

	function normalizeFields(normalfields) {
		return normalfields.map(field => {
			if (field.type === 'all' || field.type === 'dynamic') {
				return {
					...field,
					by: field.by.map(b => normalizeField(b)),
				};
			}
			return normalizeField(field);
		});
	}

	function normalizeField(field) {
		if (typeof field === 'string')
			return { id: field, type: 'text', filter: 'contains' };
		return {
			...field,
			filter: field.filter || (field.options ? 'equal' : 'contains'),
			options:
				field.type !== 'date' &&
				field.options &&
				getFieldOptions(field),
		};
	}

	function getFieldOptions(field) {
		const options = field.options.map(a => {
			if (typeof a === 'string' || typeof a === 'number') {
				return { id : a, label : a };
			}
			return a;
		});
		options.unshift({ id: '$empty', label: _('None') });
		return options;
	}

	function getDynamicOptions(arr) {
		return arr.map(a => ({ id: a.id, label: a.label }));
	}

</script>

<div class='wx-filter-bar'>
	{#each filters as filter, i (filter)}
		{#if filter.dynamicField}
			<div class='wx-select'>
				<RichSelect
					onchange = {({ value }) => updateFiltersField(value, i)}
					options  = {filter.optionsBy}
					value    = {filter.field}
				/>
			</div>
		{/if}
		{#if filter.options}
			<div class='wx-select'>
				<RichSelect
					onchange    = {({ value }) => updateValue(value, filter.field, 1)}
					options     = {filter.options}
					placeholder = {filter.placeholder ?? `${_('filter by')} ${filter.field}`}
					value       = {filter.value}
				/>
			</div>
		{:else if filter.type === 'text' || filter.type === 'number'}
			<div class='wx-text'>
				<Text
					onchange    = {({ value, input }) => { if (input) updateValue(value, filter.field, 0); }}
					placeholder = {filter.placeholder ?? `${_('filter by')} ${filter.field} (${_(filter.filter)})`}
					type        = {filter.type}
					value       = {filter.value}
				/>
			</div>
		{:else if filter.type === 'date'}
			<div class='wx-date'>
				{#if filter.filter === 'between' || filter.filter === 'notBetween'}
					<DateRangePicker
						buttons     = {['done', 'clear', 'today']}
						format      = {f}
						onchange    = {({ value }) => updateValue(value, filter.field, 1)}
						placeholder = {filter.placeholder ?? `${_('filter by')} ${filter.field} (${_(filter.filter)})`}
						value       = {filter.value}
					/>
				{:else}
					<DatePicker
						format      = {f}
						onchange    = {({ value }) => updateValue(value, filter.field, 1)}
						placeholder = {filter.placeholder ?? `${_('filter by')} ${filter.field} (${_(filter.filter)})`}
						value       = {filter.value}
					/>
				{/if}
			</div>
		{/if}
	{/each}
</div>

<style>
	.wx-filter-bar {
		display : flex;
		padding : 14px 2px;
		width   : 610px;
		gap     : 10px;
	}

	.wx-select {
		flex: 1;
	}

	.wx-text,
	.wx-date {
		flex: 2;
	}
</style>
