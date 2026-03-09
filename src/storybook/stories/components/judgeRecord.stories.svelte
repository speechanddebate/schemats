<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { faker } from '@faker-js/faker';
	import JudgeRecord from '../../../lib/components/judgeRecord.svelte';
	import { fakeJudgeRecord } from '../../utils/fakerUtils';

	const { Story } = defineMeta({
		component: JudgeRecord,
	});
	</script>

	<Story
	name="Default"
	args = {{
		records: faker.helpers.arrayElements(Array.from({ length: 20 }, () => fakeJudgeRecord())),
	}}
	/>
