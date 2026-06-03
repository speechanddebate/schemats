<script lang="ts">
	import { createRestQuizzes } from '$indexcards';
	import { handleOrval } from '$lib/helpers/query';
    import Quiz from '../../../paradigms/[id]/Quiz.svelte';

	const quizzesQuery = createRestQuizzes();
	const results = $derived(handleOrval(quizzesQuery) ?? []);
</script>
<div class="flex flex-col gap-4 p-4">
	{#each results as quiz (quiz.id)}
	<Quiz {quiz} variant="self" />
	{/each}
</div>

