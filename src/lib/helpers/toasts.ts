
export type ToastSeverity = 'info' | 'warning' | 'error' | 'success';

export type ToastNotification = {
	message: string;
	detail?: string;
	severity?: ToastSeverity;
	status?: number;
	requestId?: string;
	timeoutMs?: number;
};

type ToastListener = (toast: ToastNotification) => void;

const listeners = new Set<ToastListener>();

/**
 * Subscribe to app-level toast notifications emitted from non-Svelte modules.
 */
export function subscribeToToasts(listener: ToastListener): () => void {
	listeners.add(listener);
	return () => {
		listeners.delete(listener);
	};
}

/**
 * Emit a toast notification to active listeners.
 */
export function publishToast(toast: ToastNotification): void {
	if (!toast.message.trim()) {
		return;
	}

	const activeListeners = Array.from(listeners);
	queueMicrotask(() => {
		for (const listener of activeListeners) {
			listener(toast);
		}
	});
}

type ToastPayload = Omit<ToastNotification, 'severity'>;

export const toast = {
	info(payload: ToastPayload): void {
		publishToast({
			...payload,
			severity: 'info',
		});
	},

	success(payload: ToastPayload): void {
		publishToast({
			...payload,
			severity: 'success',
		});
	},

	warning(payload: ToastPayload): void {
		publishToast({
			...payload,
			severity: 'warning',
		});
	},

	error(payload: ToastPayload): void {
		publishToast({
			...payload,
			severity: 'error',
		});
	},
};
