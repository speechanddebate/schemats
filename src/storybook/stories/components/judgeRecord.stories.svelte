<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { faker } from '@faker-js/faker';
	import JudgeRecord from '../../../lib/components/judgeRecord.svelte';
	import { fakeJudgeRecord } from '../../utils/fakerUtils';

	const { Story } = defineMeta({
		component: JudgeRecord,
		parameters: {
			a11y: {
				config: {
					rules: [
						// @svar SVGrid library renders aria-label on role="presentation" elements
						{ id: 'aria-prohibited-attr', enabled: false },
						// @svar SVGrid library sets aria-rowindex="0" which is invalid
						{ id: 'aria-valid-attr-value', enabled: false },
						// @svar pager/filter inputs lack labels (third-party component)
						{ id: 'label', enabled: false },
					],
				},
			},
		},
	});
	</script>

	<Story
	name="Default"
	args = {{
		records: faker.helpers.arrayElements(Array.from({ length: 20 }, () => fakeJudgeRecord())),
	}}
	/>
