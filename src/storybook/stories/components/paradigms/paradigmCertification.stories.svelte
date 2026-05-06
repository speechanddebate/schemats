<script module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import { faker } from '@faker-js/faker';
	import ParadigmCertification from '../../../../routes/paradigms/[id]/paradigmCertification.svelte';

	const { Story } = defineMeta({
		component: ParadigmCertification,
	});
	</script>

	<Story
	name="Default"
	args={{
		cert: {
			title: faker.lorem.words(3),
			description: faker.lorem.paragraph(),
			updatedAt: new Date().toISOString(),
			badge: {
				altText: faker.lorem.words(3),
				link: faker.internet.url(),
				imageUrl: faker.image.url({ width: 100, height: 100 }),
			},
		},
	}}
	/>
	<Story
	name="No badge"
	args={{
		cert: {
			title: faker.lorem.words(3),
			description: faker.lorem.paragraph(),
			updatedAt: new Date().toISOString(),
			badge: undefined,
		},
	}}
	/>
	<Story
	name="No updatedAt"
	args={{
		cert: {
			title: faker.lorem.words(3),
			description: faker.lorem.paragraph(),
			updatedAt: undefined,
			badge: {
				altText: faker.lorem.words(3),
				link: faker.internet.url(),
				imageUrl: faker.image.url({ width: 100, height: 100 }),
			},
		},
	}}
	/>