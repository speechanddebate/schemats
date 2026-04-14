import {
	createTableHook,
	createSortedRowModel,
	columnResizingFeature,
	columnSizingFeature,
	rowSortingFeature,
	sortFns,
	tableFeatures,
} from '@tanstack/svelte-table';

const appTableFeatures = tableFeatures({
	rowSortingFeature,
	columnResizingFeature,
	columnSizingFeature,
});

export const {
	appFeatures,
	createAppTable,
	createAppColumnHelper,
} = createTableHook({
	_features: appTableFeatures,
	_rowModels: {
		sortedRowModel: createSortedRowModel(sortFns),
	},
});
