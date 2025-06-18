import { useSearch } from '@tanstack/react-router';
import { Play } from 'lucide-react';
import { PageLink } from './PageLink';
import { usePagination } from './usePagination';

const nf = Intl.NumberFormat('en-US');

interface Props {
	count: number;
	hasMore: boolean;
	isLoading: boolean;
	pageSize?: number;
}

export const Paginator = ({ count, hasMore, isLoading }: Props) => {
	const search = useSearch({ strict: false });
	const { page: currentPage = 0 } = search;

	const {
		firstResultIndex,
		hasNextPage,
		hasPreviousPage,
		lastResultIndex,
		nextPage,
		previousPage,
	} = usePagination({ currentPage, hasMore, count });

	const currentlyShowing = `Showing ${nf.format(firstResultIndex + 1)}-${nf.format(
		lastResultIndex + 1,
	)}`;

	const classes = `flex items-center justify-between gap-4 ${
		isLoading ? 'invisible' : ''
	}`;

	return (
		<div className="bg-neutral-800 p-4 sm:rounded-lg">
			<div className={classes}>
				<div>{currentlyShowing}</div>
				<div className="flex -space-x-px">
					<PageLink
						isDisabled={!hasPreviousPage}
						className="rounded-l"
						page={previousPage}
					>
						<Play className="my-auto rotate-180" size={16} />
					</PageLink>

					<PageLink isDisabled={!hasNextPage} className="rounded-r" page={nextPage}>
						<Play className="my-auto" size={16} />
					</PageLink>
				</div>
			</div>
		</div>
	);
};
