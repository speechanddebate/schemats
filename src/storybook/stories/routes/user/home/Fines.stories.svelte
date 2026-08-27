<script lang="ts" module>
import { defineMeta } from '@storybook/addon-svelte-csf';
import { faker } from '@faker-js/faker';
import Fine from '../../../../../routes/user/home/Fine.svelte';

const { Story } = defineMeta({
	component: Fine,
});
</script>

<Story
	name="Fine | Default"
	args={{
		fine: {
			id: 1,
			currency: '$',
			amount: 100.0,
			reason: `JUDGE FINE: ${faker.person.firstName()} ${faker.person.lastName()}`,
			school: 'example school',
			levied: faker.date.recent(),
		},
	}}
/>
