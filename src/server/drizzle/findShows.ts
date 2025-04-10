import { createServerFn } from '@tanstack/react-start';
import { parseISO } from 'date-fns';
import { PAGE_SIZE } from '~/constants/constants';
import type { TvSearchForm } from '~/utils/searchParams/types';
import { db } from './db/drizzle';

export type Show = Awaited<ReturnType<typeof findShows>>['shows'][number];

export const findShows = createServerFn()
	.validator((data: TvSearchForm) => data)
	.handler(async (ctx) => {
		const start = Date.now();
		const search = ctx.data;

		const _shows = await db.query.show.findMany({
			with: { providers: { columns: { providerId: true } } },
			where: {
				name: { ilike: `%${search.name}%` },
				voteCount: { gte: search.minVotes, lte: search.maxVotes },
				voteAverage: { gte: search.minRating, lte: search.maxRating },
				...(search.genre && { genreId: { eq: search.genre } }),
				...(search.language && { languageId: { eq: search.language } }),
				...((search.minLastAirDate || search.maxLastAirDate) && {
					lastAirDate: {
						...(search.minLastAirDate && { gte: parseISO(search.minLastAirDate) }),
						...(search.maxLastAirDate && { lte: parseISO(search.maxLastAirDate) }),
					},
				}),
				...(search.providers.length > 0 && {
					providers: { providerId: { in: search.providers } },
				}),
				...(search.creditName && {
					credits: {
						person: { name: { ilike: `%${search.creditName}%` } },
					},
				}),
			},
			orderBy: { [search.sortColumn]: search.ascending ? 'asc' : 'desc' },
			limit: PAGE_SIZE + 1,
			offset: search.page * PAGE_SIZE,
		});

		const hasMore = _shows.length > PAGE_SIZE;
		const shows = _shows.slice(0, PAGE_SIZE);

		console.log(`took ${Date.now() - start} ms`);
		return { shows, hasMore };
	});
