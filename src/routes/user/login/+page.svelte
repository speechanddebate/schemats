<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import { indexMutation } from '$lib/indexfetch';
	import type { Problem } from '$lib/types/Problem';
	import { useQueryClient } from '@tanstack/svelte-query';

	import config from '$config';

	let username = $state('');
	let password = $state('');
	let error: Problem | null = $state(null);
	let isSubmitting = $state(false);
	const queryClient = useQueryClient();
	const sessionQueryUrl = `${config.indexcards.basePath}/user/session`;

	const redirectParam = $derived(page.url.searchParams.get('redirect'));

	const getSafeRedirect = (value: string | null): string => {
		if (!value) {
			return '/';
		}

		try {
			const decoded = decodeURIComponent(value);
			return decoded.startsWith('/') ? decoded : '/';
		} catch {
			return '/';
		}
	};

	const redirectTarget = $derived(getSafeRedirect(redirectParam));

	const loginMutation = indexMutation<unknown, { username: string; password: string }>(
		'/auth/login',
		(variables) => ({
			method  : 'POST',
			headers : {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(variables),
		})
	);

	const submit = async () => {
		if (isSubmitting) {
			return;
		}

		error = null;
		isSubmitting = true;

		try {
			await loginMutation.mutateAsync({ username, password });
			await queryClient.invalidateQueries({ queryKey: [sessionQueryUrl] });
			await goto(resolve(redirectTarget, {}), { replaceState: true, invalidateAll: true });
		} catch (err) {
			const problem = err as Problem;
			error = {
				status   : problem?.status,
				title    : problem?.title || 'Login failed',
				detail   : problem?.detail || 'Please check your credentials and try again.',
				instance : problem?.instance || String(err),
			};
		} finally {
			isSubmitting = false;
		}
	};
</script>

<div class="flex w-full justify-center py-10">
	<div class="w-full max-w-md bg-back-100 border border-back-300 rounded-md p-6">
		<h2 class="text-xl font-semibold text-primary-900">Sign in</h2>
		<p class="text-sm text-back-700 mb-4">
			Use the email address tied to your Tabroom account.
		</p>

		{#if error}
			<div class="border border-error-400 bg-error-50 text-error-900 p-3 rounded mb-4">
				<div class="font-semibold">{error.title}</div>
				<div class="text-sm">{error.detail}</div>
				{#if error.status}
					<div class="text-xs opacity-80">Status: {error.status}</div>
				{/if}
			</div>
		{/if}

		<form class="flex flex-col gap-4" onsubmit={submit}>
			<label class="flex flex-col gap-1">
				<span class="text-sm font-semibold">Email</span>
				<input
					class="form-input p-2 rounded border border-back-300"
					autocomplete="username"
					required
					bind:value={username}
				/>
			</label>

			<label class="flex flex-col gap-1">
				<span class="text-sm font-semibold">Password</span>
				<input
					class="form-input p-2 rounded border border-back-300"
					autocomplete="current-password"
					required
					type="password"
					bind:value={password}
				/>
			</label>

			<button
				class="
					bg-success-700
					text-stone-50
					font-semibold
					rounded-md
					py-2
					hover:bg-success-600
					disabled:opacity-60"
				disabled={isSubmitting}
				type="submit"
			>
				{isSubmitting ? 'Signing in...' : 'Sign in'}
			</button>
		</form>
	</div>
</div>
