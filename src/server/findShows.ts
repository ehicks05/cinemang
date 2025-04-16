import { createServerFn } from '@tanstack/react-start';
import type { TvSearchForm } from '~/utils/searchParams/types';
import { type FindShowsReturn, findShowsQuery } from './findShowsQuery';
import { storage } from './storage';

export const findShows = createServerFn()
	.validator((data: TvSearchForm) => data)
	.handler(async ({ data: search }) => {
		const cacheKey = JSON.stringify(search);
		const cachedResponse = await storage.get<FindShowsReturn>(cacheKey);
		if (cachedResponse) {
			return {
				...cachedResponse,
				shows: cachedResponse.shows.map((o) => ({
					...o,
					firstAirDate: new Date(o.firstAirDate),
					lastAirDate: new Date(o.lastAirDate),
				})),
			};
		}

		const result = await findShowsQuery(search);
		storage.set(cacheKey, result);

		return result;
	});
