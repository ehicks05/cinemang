import { createServerFn } from '@tanstack/react-start';
import { parseISO } from 'date-fns';
import { count } from 'drizzle-orm';
import { PAGE_SIZE } from '~/constants/constants';
import { movie } from '~/server/drizzle/db/schema';
import type { MovieSearchForm } from '~/utils/searchParams/types';
import { db } from './db/drizzle';

export type Film = Awaited<ReturnType<typeof findFilms>>['films'][number];

export const findFilms = createServerFn()
	.validator((data: MovieSearchForm) => data)
	.handler(async (ctx) => {
		const start = Date.now();
		const search = ctx.data;

		const where = {
			title: { ilike: `%${search.title}%` },
			voteCount: { gte: search.minVotes, lte: search.maxVotes },
			voteAverage: { gte: search.minRating, lte: search.maxRating },
			...(search.genre && { genreId: { eq: search.genre } }),
			...(search.language && { languageId: { eq: search.language } }),
			...((search.minReleasedAt || search.maxReleasedAt) && {
				releasedAt: {
					gte: parseISO(search.minReleasedAt) || undefined,
					lte: parseISO(search.maxReleasedAt) || undefined,
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

		// const _count = await db.select({ count: count() }).from(movie).where(where);
		const _count = 1;

		const films = await db.query.movie.findMany({
			with: { providers: { columns: { providerId: true } } },
			where,
			orderBy: { [search.sortColumn]: search.ascending ? 'asc' : 'desc' },
			limit: PAGE_SIZE,
			offset: search.page * PAGE_SIZE,
		});

		console.log(`took ${Date.now() - start} ms`);
		return { count: _count, films };
	});
