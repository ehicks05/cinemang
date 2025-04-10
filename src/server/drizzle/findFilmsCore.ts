import { createServerFn } from '@tanstack/react-start';
import { parseISO } from 'date-fns';
import {
	and,
	asc,
	count,
	desc,
	eq,
	exists,
	gte,
	ilike,
	inArray,
	lte,
} from 'drizzle-orm';
import { PAGE_SIZE } from '~/constants/constants';
import {
	credit,
	mediaProvider,
	movie,
	person,
	provider,
} from '~/server/drizzle/db/schema';
import type { MovieSearchForm } from '~/utils/searchParams/types';
import { db } from './db/drizzle';

export type Film = Awaited<ReturnType<typeof findFilms>>['films'][number];

export const findFilms = createServerFn()
	.validator((data: MovieSearchForm) => data)
	.handler(async (ctx) => {
		const start = Date.now();
		const search = ctx.data;

		const where = and(
			ilike(movie.title, `%${search.title}%`),
			gte(movie.voteCount, search.minVotes),
			lte(movie.voteCount, search.maxVotes),
			gte(movie.voteAverage, search.minRating),
			lte(movie.voteAverage, search.maxRating),
			search.genre ? eq(movie.genreId, search.genre) : undefined,
			search.language ? eq(movie.languageId, search.language) : undefined,
			search.minReleasedAt
				? gte(movie.releasedAt, parseISO(search.minReleasedAt))
				: undefined,
			search.maxReleasedAt
				? lte(movie.releasedAt, parseISO(search.maxReleasedAt))
				: undefined,
			search.creditName ? ilike(person.name, `%${search.creditName}%`) : undefined,

			inArray(mediaProvider.providerId, [8, 9]),
		);

		const _count = await db
			.select({ count: count() })
			.from(movie)
			.leftJoin(credit, eq(movie.id, credit.movieId))
			.leftJoin(person, eq(credit.personId, person.id))
			.leftJoin(mediaProvider, eq(movie.id, mediaProvider.movieId))
			.leftJoin(mediaProvider, eq(movie.id, mediaProvider.movieId))
			.where(where);

		console.log({ _count });

		const films = await db
			.select() // todo only select mediaProvider.providerId
			.from(movie)
			.leftJoin(credit, eq(movie.id, credit.movieId))
			.leftJoin(person, eq(credit.personId, person.id))
			.leftJoin(mediaProvider, eq(movie.id, mediaProvider.movieId))
			.where(where)
			.orderBy(
				search.ascending
					? // @ts-ignore
						asc(movie[search.sortColumn])
					: // @ts-ignore
						desc(movie[search.sortColumn]),
			)
			.limit(PAGE_SIZE)
			.offset(search.page * PAGE_SIZE);

		console.log(`took ${Date.now() - start} ms`);
		return {
			count: _count[0].count,
			films: films.map((o) => ({
				...o.movie,
				providers: [{ providerId: o.media_provider?.providerId }],
			})),
		};
	});
