 <script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import type { UserChapter } from '$indexcards/schemas';
	import Chapters from '../../../../../routes/user/home/Chapters.svelte';

	const chapters: UserChapter[] = [
		{
			id: 12,
			name: 'Foobar High School',
			permission: 'chapter',
		},
		{
			id: 13,
			name: 'Foobar Middle School',
			permission: 'chapter',
		},
	];

	const { Story } = defineMeta({
		title: 'Routes/User/Home/Chapters',
		component: Chapters,
	});
</script>

<Story
	name="Default"
	args={{ chapters }}
/>