import type { Prisma } from '@prisma/client';
import { createServerFn } from '@tanstack/react-start';
import type { MovieSearchForm } from '~/utils/searchParams/types';
import prisma from './prisma';

export const findFilms = createServerFn()
	.validator((data: MovieSearchForm) => data)
	.handler(async (ctx) => {
		const search = ctx.data;

		let personIds: number[] = [];
		if (search.creditName) {
			const persons = await prisma.person.findMany({
				select: { id: true },
				where: { name: { contains: search.creditName } },
				orderBy: { popularity: 'desc' },
				take: 50,
			});
			personIds = persons.map((o) => o.id);
		}

		const where: Prisma.MovieWhereInput = {
			title: { contains: search.title },
			voteCount: { gte: search.minVotes, lte: search.maxVotes },
			voteAverage: { gte: search.minRating, lte: search.maxRating },
			genreId: { equals: search.genre },
			languageId: { equals: search.language },
			// releasedAt: { gte: search.minReleasedAt, lte: search.maxReleasedAt },
			providers: { some: { id: { in: search.providers.map(String) } } },
			credits: { some: { personId: { in: personIds } } },
		};

		const count = await prisma.movie.count({ where });
		const films = await prisma.movie.findMany({
			include: { providers: true },
			take: 20,
			skip: search.page * 20,
			where,
			orderBy: {
				[search.sortColumn === 'released_at' ? 'releasedAt' : 'releasedAt']:
					search.ascending ? 'asc' : 'desc',
			},
		});

		return { search: ctx.data, count, films };
	});
