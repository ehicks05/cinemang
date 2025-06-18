import { PAGE_SIZE } from '~/constants/constants';

interface Params {
	currentPage: number;
	pageSize?: number;
	hasMore: boolean;
	count: number;
}

export const usePagination = ({
	currentPage,
	pageSize = PAGE_SIZE,
	hasMore,
	count,
}: Params) => {
	const previousPage = currentPage - 1;
	const nextPage = currentPage + 1;

	const hasPreviousPage = previousPage >= 0;
	const hasNextPage = hasMore;

	const firstResultIndex = currentPage * pageSize;
	const lastResultIndex = Math.min(firstResultIndex + count - 1);

	return {
		firstResultIndex,
		hasNextPage,
		hasPreviousPage,
		lastResultIndex,
		nextPage,
		previousPage,
	};
};
