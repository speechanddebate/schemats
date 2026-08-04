<script lang="ts" module>
import { defineMeta } from '@storybook/addon-svelte-csf';
import { faker } from '@faker-js/faker';
import Fines from '../../../../../routes/user/home/Fines.svelte';

const { Story } = defineMeta({
	component: Fines,
});
</script>

<Story
	name="Fines | Default"
	args={{
		fines: [
			{
				id: 1,
				currency: '$',
				amount: 100.0,
				reason: `JUDGE FINE: ${faker.person.firstName()} ${faker.person.lastName()}`,
				school: 'example school',
				levied: faker.date.recent(),
			},
			{
				id: 2,
				currency: '$',
				amount: 100.0,
				reason: `JUDGE FINE: ${faker.person.firstName()} ${faker.person.lastName()}`,
				school: 'example school',
				levied: faker.date.recent(),
			},
		],
	}}
/>
