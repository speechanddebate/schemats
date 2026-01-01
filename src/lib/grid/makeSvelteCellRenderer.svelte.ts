import type {
	ICellRenderer,
	ICellRendererParams,
} from 'ag-grid-community';
import { mount, unmount, type Component } from 'svelte';

export default function makeSvelteCellRenderer(
	RenderingComponent: Component<ICellRendererParams>,
	containerDivClass?: string,
) {
	///www/schemats/src/lib/grid/makeSvelteCellRenderer.svelte.ts
	return class SvelteCellRenderer implements ICellRenderer {
		element   : HTMLElement | undefined = undefined;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		component : Record<string, any> | undefined = undefined;
		props     : ICellRendererParams | undefined = $state(undefined);

		init(params: ICellRendererParams) {
			this.element = document.createElement('div');

			if (containerDivClass) {
				this.element.classList.add(containerDivClass);
			}

			this.props = params;

			this.component = mount(RenderingComponent, {
				target: this.element,
				props: this.props,
			});
		}

		getGui() {
			return this.element;
		}

		destroy() {
			if (this.component !== undefined) {
				unmount(this.component);
				this.element?.remove();
				this.component = undefined;
			}
		}

		refresh(params: ICellRendererParams): boolean {
			if (this.props === undefined) {
				return false;
			}

			try {
				Object.assign(this.props, params);
				return true;
			} catch (error) {
				console.error(error);
				return false;
			}
		}
	};
}
