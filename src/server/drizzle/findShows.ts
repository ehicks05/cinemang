import { createServerFn } from '@tanstack/react-start';
import { PAGE_SIZE } from '~/constants/constants';
import type { TvSearchForm } from '~/utils/searchParams/types';
import { db } from './db/drizzle';

export type Show = Awaited<ReturnType<typeof findShows>>['shows'][number];

export const findShows = createServerFn()
	.validator((data: TvSearchForm) => data)
	.handler(async (ctx) => {
		const search = ctx.data;

		const where = {
			name: { ilike: `%${search.name}%` },
			voteCount: { gte: search.minVotes, lte: search.maxVotes },
			voteAverage: { gte: search.minRating, lte: search.maxRating },
			...(search.genre && { genreId: { eq: search.genre } }),
			...(search.language && { languageId: { eq: search.language } }),
			...((search.minLastAirDate || search.maxLastAirDate) && {
				releasedAt: {
					gte: search.minLastAirDate || undefined,
					lte: search.maxLastAirDate || undefined,
				},
			}),

			...(search.providers.length > 0 && {
				providers: { id: { in: search.providers.map(String) } },
			}),
			...(search.creditName && {
				credits: {
					person: { name: { ilike: `%${search.creditName}%` } },
				},
			}),
		};

		// const _count = await prisma.show.count({ where });
		const _count = 1;

		const shows = await db.query.show.findMany({
			with: { providers: { columns: { providerId: true } } },
			where,
			orderBy: { [search.sortColumn]: search.ascending ? 'asc' : 'desc' },
			limit: PAGE_SIZE,
			offset: search.page * PAGE_SIZE,
		});

		return { count: _count, shows };
	});
