
<script lang="ts" module>
import { defineMeta } from '@storybook/addon-svelte-csf';
import { faker } from '@faker-js/faker';
import LiveDocs from '../../../../../routes/user/home/LiveDocs.svelte';

const { Story } = defineMeta({
	component: LiveDocs,
});
</script>

<Story
	name="Live Docs | Default"
	args={{
		livedocs: [
			{
				tournName: `Tournament Name`,
				categoryAbbr: 'VPF',
				url: faker.internet.url(),
				caption: `Example Caption`,
				judgeId: faker.number.int({ min: 1, max: 1000 }),
				tournTz: faker.word.noun(),
				tournEnd: faker.date.future().toISOString(),
			},
			{
				tournName: `Tournament Name`,
				categoryAbbr: 'JVLD',
				url: faker.internet.url(),
				caption: null,
				judgeId: faker.number.int({ min: 1, max: 1000 }),
				tournTz: faker.word.noun(),
				tournEnd: faker.date.future().toISOString(),
			},
		],
	}}
/>
