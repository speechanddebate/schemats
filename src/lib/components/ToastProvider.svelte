<script lang="ts">
	import { onDestroy } from 'svelte';
	import { ToastContainer } from 'flowbite-svelte';
	import Toast from '$lib/components/Toast.svelte';
	import type { ToastNotification } from '$lib/helpers/toasts';
	import { subscribeToToasts } from '$lib/helpers/toasts';

	type ToastItem = ToastNotification & {
		id: number;
		visible: boolean;
		timeoutId?: ReturnType<typeof setTimeout>;
	};

	const DEFAULT_TIMEOUT_MS = 8000;
	const OUTRO_MS = 300;

	let toasts = $state<ToastItem[]>([]);
	let nextId = 1;

	function dismissToast(id: number): void {
		const toast = toasts.find((item) => item.id === id);
		if (toast?.timeoutId) {
			clearTimeout(toast.timeoutId);
		}

		toasts = toasts.map((item) => (item.id === id ? { ...item, visible: false } : item));
		setTimeout(() => {
			toasts = toasts.filter((item) => item.id !== id);
		}, OUTRO_MS);
	}

	function addToast(toast: ToastNotification): void {
		const item: ToastItem = {
			...toast,
			id: nextId,
			visible: true,
		};
		nextId += 1;

		const timeoutMs = toast.timeoutMs ?? DEFAULT_TIMEOUT_MS;
		if (timeoutMs > 0) {
			item.timeoutId = setTimeout(() => {
				dismissToast(item.id);
			}, timeoutMs);
		}

		toasts = [...toasts, item];
	}

	const unsubscribe = subscribeToToasts(addToast);

	onDestroy(() => {
		unsubscribe();
		for (const toast of toasts) {
			if (toast.timeoutId) {
				clearTimeout(toast.timeoutId);
			}
		}
	});
</script>

<ToastContainer position="bottom-left">
	{#each toasts as toast (toast.id)}
		<Toast
			detail={toast.detail}
			message={toast.message}
			onclose={() => dismissToast(toast.id)}
			severity={toast.severity}
			visible={toast.visible}
		/>
	{/each}
</ToastContainer>