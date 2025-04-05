import {
	type Interval,
	addMonths,
	eachYearOfInterval,
	format,
	lastDayOfYear,
	subMonths,
} from 'date-fns';
import { tmdbClient } from '../client/throttledClient.js';

export const MIN_VOTES = '64';

const RECENCY_CLAUSE_KEY = {
	movie: 'primary_release_date',
	tv: 'first_air_date',
};

const getIdsForInterval = async (media: 'movie' | 'tv', interval: Interval) => {
	const params = new URLSearchParams({
		'vote_count.gte': MIN_VOTES,
		[`${RECENCY_CLAUSE_KEY[media]}.gte`]: format(interval.start, 'yyyy-MM-dd'),
		[`${RECENCY_CLAUSE_KEY[media]}.lte`]: format(interval.end, 'yyyy-MM-dd'),
	});

	const path = `/discover/${media}?${params.toString()}`;
	const { data } = await tmdbClient(path);

	const ids: number[] = data.results.map((o: { id: number }) => o.id);
	const pages = data.total_pages;

	let page = 1;
	while (page < pages) {
		page += 1;
		const { data } = await tmdbClient(`${path}&page=${page}`);
		ids.push(data.results.map((o: { id: number }) => o.id));
	}

	return ids.flat();
};

const FULL_INTERVALS = eachYearOfInterval({
	start: new Date('1874-01-01'),
	end: addMonths(new Date(), 1),
});
const DEBUG_INTERVALS = eachYearOfInterval({
	start: new Date('1995-01-01'),
	end: new Date('1995-12-31'),
});

/**
 * If `isFullMode`, grab all yearly intervals back to the oldest movie (from 1874)
 * If not, grab one interval covering the last 3 months
 */
export const discoverMediaIds = async (
	media: 'movie' | 'tv',
	isFullMode = false,
) => {
	const fullIntervals = FULL_INTERVALS.map((date) => ({
		start: date,
		end: lastDayOfYear(date),
	}));

	const partialIntervals = [{ start: subMonths(new Date(), 3), end: new Date() }];

	const intervals = isFullMode ? fullIntervals : partialIntervals;

	const idsByYear = await Promise.all(
		intervals.map((interval: Interval) => getIdsForInterval(media, interval)),
	);

	return idsByYear.flat();
};
