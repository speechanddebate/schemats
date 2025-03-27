import {
	AgPromise,
	type IFrameworkOverrides,
} from 'ag-grid-community';

export default class SvelteFrameworkOverrides implements IFrameworkOverrides {

	setInterval(action: () => void, interval?: number): AgPromise<number> {
		return new AgPromise<number>((resolve) => {
			const id = window.setInterval(action, interval);
			resolve(id);
		});
	}
	addEventListener(
		element: HTMLElement,
		type: string,
		listener: EventListenerOrEventListenerObject,
		options?: boolean | AddEventListenerOptions,
	): void {
		element.addEventListener(type, listener, options);
	}

	wrapIncoming: <T>(
		// eslint-disable-next-line no-unused-vars
		callback: () => T,
	) => T = (callback) => {
			return callback();
		};

	wrapOutgoing: <T>(
		// eslint-disable-next-line no-unused-vars
		callback: () => T
	) => T = (callback) => {
			// Implement any specific logic needed for outgoing callbacks
			return callback();
		};

	shouldWrapOutgoing?: boolean | undefined = false;

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	frameworkComponent(name: string, components?: any) {
		// Implement logic to return the framework component
		if (components && components[name]) {
			return components[name];
		}
	}

	renderingEngine: 'vanilla' | 'react' = 'vanilla';

	getDocLink(path?: string): string {
		const baseUrl = 'https://www.npmjs.com/package/ag-grid-svelte5';
		return path ? `${baseUrl}/${path}` : baseUrl;
	}

	batchFrameworkComps: boolean = true;

	getLockOnRefresh?(): void {
		// Implement logic to lock on refresh if needed
		//console.log('Lock on refresh acquired');
	}

	releaseLockOnRefresh?(): void {
		// Implement logic to release lock on refresh if needed
		//console.log('Lock on refresh released');
	}

	runWhenReadyAsync?(): boolean {
		// Implement logic to determine if async operations should run when ready
		return true;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	isFrameworkComponent(comp: any): boolean {
		// Implement logic to determine if the component is a framework component
		return !!comp && typeof comp === 'object' && 'render' in comp;
	}
}