import { createServerFn } from '@tanstack/react-start';
import { PAGE_SIZE } from '~/constants/constants';
import type { Prisma } from '@prisma/client/.prisma/client/index.js';
import type { TvSearchForm } from '~/utils/searchParams/types';
import prisma from './prisma';

export type Show = Awaited<ReturnType<typeof findShows>>['shows'][number];

export const findShows = createServerFn()
	.validator((data: TvSearchForm) => data)
	.handler(async (ctx) => {
		const search = ctx.data;
		console.log(search);

		const where: Prisma.ShowWhereInput = {
			name: { contains: search.name, mode: 'insensitive' },
			voteCount: { gte: search.minVotes, lte: search.maxVotes },
			voteAverage: { gte: search.minRating, lte: search.maxRating },
			...(search.genre && { genreId: { equals: search.genre } }),
			...(search.language && { languageId: { equals: search.language } }),
			...((search.minLastAirDate || search.maxLastAirDate) && {
				lastAirDate: {
					gte: search.minLastAirDate || undefined,
					lte: search.maxLastAirDate || undefined,
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

		const count = await prisma.show.count({ where });
		const shows = await prisma.show.findMany({
			include: { providers: { select: { providerId: true } } },
			take: PAGE_SIZE,
			skip: search.page * PAGE_SIZE,
			where,
			orderBy: { [search.sortColumn]: search.ascending ? 'asc' : 'desc' },
		});

		return { count, shows };
	});
