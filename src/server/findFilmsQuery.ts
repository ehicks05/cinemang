import { parseISO } from 'date-fns';
import { PAGE_SIZE } from '~/constants/constants';
import type { MovieSearchForm } from '~/utils/searchParams/types';
import { db } from './db/drizzle';

export type FindFilmsReturn = Awaited<ReturnType<typeof findFilmsQuery>>;
export type Film = FindFilmsReturn['films'][number];

export const findFilmsQuery = async (search: MovieSearchForm) => {
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

	return { films, hasMore };
};
