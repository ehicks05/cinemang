import { useLocation, useSearch } from '@tanstack/react-router';
import { FastForward, Play } from 'lucide-react';
import { PageLink } from './PageLink';
import { usePaginationSimple } from './usePagination';

const nf = Intl.NumberFormat('en-US');

interface Props {
	count: number;
	hasMore: boolean;
	isLoading: boolean;
	pageSize?: number;
}

export const PaginatorSimple = ({ count, hasMore, isLoading }: Props) => {
	const { pathname } = useLocation();
	// todo: investigate why using `strict: false` instead of `from` briefly shows an error
	// const from = pathname === '/tv' ? '/tv/' : '/films/';
	const search = useSearch({ strict: false });
	const { page: currentPage = 0 } = search;

	const {
		firstResultIndex,
		hasNextPage,
		hasPreviousPage,
		lastResultIndex,
		nextPage,
		previousPage,
	} = usePaginationSimple({ currentPage, hasMore, count });

	const currentlyShowing = `Showing ${nf.format(firstResultIndex + 1)}-${nf.format(
		lastResultIndex + 1,
	)}`;

	return (
		<div className="bg-neutral-800 p-4 sm:rounded-lg">
			<div
				className={`flex flex-col items-center justify-between gap-4 sm:flex-row ${
					isLoading ? 'invisible' : ''
				}`}
			>
				<div>{currentlyShowing}</div>
				<div className="flex -space-x-px">
					<PageLink isDisabled={!hasPreviousPage} className="rounded-l" page={0}>
						<FastForward className="my-auto rotate-180" size={16} />
					</PageLink>
					<PageLink isDisabled={!hasPreviousPage} page={previousPage}>
						<Play className="my-auto rotate-180" size={16} />
					</PageLink>

					<PageLink isDisabled={!hasNextPage} page={nextPage}>
						<Play className="my-auto" size={16} />
					</PageLink>
				</div>
			</div>
		</div>
	);
};
