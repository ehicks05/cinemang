import { createServerFn } from '@tanstack/react-start';
import { parseISO } from 'date-fns';
import { PAGE_SIZE } from '~/constants/constants';
import type { MovieSearchForm } from '~/utils/searchParams/types';
import { db } from './db/drizzle';

// TODO: fix
// relational-query-builder doesn't support count, so we have to build a
// regular select-style query to get the count...
// const getCount = async (search: MovieSearchForm) => {
// 	const __count = await db
// 		.select()
// 		.from(movie)
// 		.leftJoin(credit, eq(movie.id, credit.movieId))
// 		.leftJoin(person, eq(credit.personId, person.id))
// 		.leftJoin(mediaProvider, eq(movie.id, mediaProvider.movieId))
// 		.where(
// 			and(
// 				ilike(movie.title, `%${search.title}%`),
// 				gte(movie.voteCount, search.minVotes),
// 				lte(movie.voteCount, search.maxVotes),
// 				gte(movie.voteAverage, search.minRating),
// 				lte(movie.voteAverage, search.maxRating),
// 				search.genre ? eq(movie.genreId, search.genre) : undefined,
// 				search.language ? eq(movie.languageId, search.language) : undefined,
// 				search.minReleasedAt
// 					? gte(movie.releasedAt, parseISO(search.minReleasedAt))
// 					: undefined,
// 				search.maxReleasedAt
// 					? lte(movie.releasedAt, parseISO(search.maxReleasedAt))
// 					: undefined,
// 				search.creditName ? ilike(person.name, `%${search.creditName}%`) : undefined,
// 				inArray(mediaProvider.providerId, search.providers),
// 			),
// 		);
// 	const _count = [...new Set(__count.map((o) => o.movie.id))].length;
// 	return _count;
// };

export type Film = Awaited<ReturnType<typeof findFilms>>['films'][number];

export const findFilms = createServerFn()
	.validator((data: MovieSearchForm) => data)
	.handler(async (ctx) => {
		const start = Date.now();
		const search = ctx.data;

		const _films = await db.query.movie.findMany({
			// extras: { count: sql`count(*)` },
			with: { providers: { columns: { providerId: true } } },
			where: {
				title: { ilike: `%${search.title}%` },
				voteCount: { gte: search.minVotes, lte: search.maxVotes },
				voteAverage: { gte: search.minRating, lte: search.maxRating },
				...(search.genre && { genreId: { eq: search.genre } }),
				...(search.language && { languageId: { eq: search.language } }),
				...((search.minReleasedAt || search.maxReleasedAt) && {
					releasedAt: {
						...(search.minReleasedAt && { gte: parseISO(search.minReleasedAt) }),
						...(search.maxReleasedAt && { lte: parseISO(search.maxReleasedAt) }),
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

		const hasMore = _films.length > PAGE_SIZE;
		const films = _films.slice(0, PAGE_SIZE);

		console.log(`took ${Date.now() - start} ms`);
		return { films, hasMore };
	});
