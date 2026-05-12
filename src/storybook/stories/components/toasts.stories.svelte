<script lang="ts" module>
	import { defineMeta } from '@storybook/addon-svelte-csf';
	import Toast from '$lib/components/Toast.svelte';

	const { Story } = defineMeta({
	});
</script>

<script lang="ts">
	import { onMount } from 'svelte';
	import { subscribeToToasts, toast, type ToastNotification } from '$lib/helpers/toasts';
	import { handleRequest } from '$lib/helpers/query';

	let allToastTypes = $state<ToastNotification[]>([]);
	let apiErrorToasts = $state<ToastNotification[]>([]);

	function collectEmittedToasts(emit: () => void): Promise<ToastNotification[]> {
		return new Promise((resolve) => {
			const collected: ToastNotification[] = [];
			const unsubscribe = subscribeToToasts((notification) => {
				collected.push(notification);
			});

			emit();

			queueMicrotask(() => {
				unsubscribe();
				resolve(collected);
			});
		});
	}

	onMount(async () => {
		allToastTypes = await collectEmittedToasts(() => {
			toast.info({
				message: 'Informational update',
				detail: 'Rounds are being paired and will be published shortly.',
			});
			toast.success({
				message: 'Success',
				detail: 'Judge assignment saved successfully.',
			});
			toast.warning({
				message: 'Warning',
				detail: 'Internet connectivity is unstable. Autosave may be delayed.',
			});
			toast.error({
				message: 'Error',
				detail: 'Unable to submit ballot. Please retry in a moment.',
			});
		});

		apiErrorToasts = await collectEmittedToasts(() => {
			handleRequest({
				status: 400,
				data: {
					title: 'Bad request',
					detail: 'The request body is missing a required field.',
				},
			});
			handleRequest({
				status: 401,
				data: {
					title: 'Unauthorized',
					detail: 'Please sign in again to continue.',
				},
			});
			handleRequest({
				status: 403,
				data: {
					title: 'Forbidden',
					detail: 'You do not have permission to access this resource.',
				},
			});
			handleRequest({
				status: 500,
				data: {
					title: 'Server error',
					detail: 'An internal server error occurred while saving the ballot.',
				},
			});
			handleRequest({
				status: 409,
				data: {
					detail: 'The API returned an unhandled 4xx problem detail response.',
				},
			});

			handleRequest({
				data: null,
				error: new Error('Network timeout'),
			});
			handleRequest({
				data: null,
				error: 'Service unavailable',
			});
			handleRequest({
				data: null,
				error: { code: 'UNKNOWN' },
			});
		});
	});
</script>

<Story name="All Toast Types">
	<section class="space-y-3 p-4" aria-labelledby="all-toast-types-heading">
		<h2 id="all-toast-types-heading" class="text-base font-semibold">All Toast Types</h2>
		<ul class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4" role="list">
			{#each allToastTypes as item, index (`${item.severity}-${item.message}-${index}`)}
				<li>
					<Toast
						detail={item.detail}
						message={item.message}
						severity={item.severity}
						visible={true}
					/>
				</li>
			{/each}
		</ul>
	</section>
</Story>

<Story name="Default API Error Toasts">
	<section class="space-y-4 p-4" aria-labelledby="default-api-errors-heading">
		<h2 id="default-api-errors-heading" class="text-base font-semibold">Default API Error Toasts</h2>

		<h3 class="text-sm font-semibold">Default API problem handlers</h3>
		<ul class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" role="list">
			{#each apiErrorToasts.slice(0, 5) as item, index (`problem-${item.severity}-${item.message}-${index}`)}
				<li>
					<Toast
						detail={item.detail}
						message={item.message}
						severity={item.severity}
						visible={true}
					/>
				</li>
			{/each}
		</ul>

		<h3 class="text-sm font-semibold">Default query error handler</h3>
		<ul class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3" role="list">
			{#each apiErrorToasts.slice(5) as item, index (`query-${item.severity}-${item.message}-${index}`)}
				<li>
					<Toast
						detail={item.detail}
						message={item.message}
						severity={item.severity}
						visible={true}
					/>
				</li>
			{/each}
		</ul>
	</section>
</Story>
