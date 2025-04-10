import type { Prisma } from '@prisma/client/.prisma/client/index.js';
import { createServerFn } from '@tanstack/react-start';
import { PAGE_SIZE } from '~/constants/constants';
import type { MovieSearchForm } from '~/utils/searchParams/types';
import prisma from './prisma';

export type Film = Awaited<ReturnType<typeof findFilms>>['films'][number];

export const findFilms = createServerFn()
	.validator((data: MovieSearchForm) => data)
	.handler(async (ctx) => {
		const start = Date.now();
		const search = ctx.data;

		const where: Prisma.MovieWhereInput = {
			title: { contains: search.title, mode: 'insensitive' },
			voteCount: { gte: search.minVotes, lte: search.maxVotes },
			voteAverage: { gte: search.minRating, lte: search.maxRating },
			...(search.genre && { genreId: { equals: search.genre } }),
			...(search.language && { languageId: { equals: search.language } }),
			...((search.minReleasedAt || search.maxReleasedAt) && {
				releasedAt: {
					gte: search.minReleasedAt || undefined,
					lte: search.maxReleasedAt || undefined,
				},
			}),

			...(search.providers.length > 0 && {
				providers: { some: { id: { in: search.providers.map(String) } } },
			}),
			...(search.creditName && {
				credits: {
					some: {
						person: { name: { contains: search.creditName, mode: 'insensitive' } },
					},
				},
			}),
		};

		const count = await prisma.movie.count({ where });
		const films = await prisma.movie.findMany({
			include: { providers: { select: { providerId: true } } },
			take: PAGE_SIZE,
			skip: search.page * PAGE_SIZE,
			where,
			orderBy: { [search.sortColumn]: search.ascending ? 'asc' : 'desc' },
		});

		console.log(`took ${Date.now() - start} ms`);
		return { count, films };
	});
