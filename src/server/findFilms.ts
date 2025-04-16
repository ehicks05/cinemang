import { createServerFn } from '@tanstack/react-start';
import type { MovieSearchForm } from '~/utils/searchParams/types';
import { type FindFilmsReturn, findFilmsQuery } from './findFilmsQuery';
import { storage } from './storage';

export const findFilms = createServerFn()
	.validator((data: MovieSearchForm) => data)
	.handler(async ({ data: search }) => {
		const cacheKey = JSON.stringify(search);
		const cachedResponse = await storage.get<FindFilmsReturn>(cacheKey);
		if (cachedResponse) {
			return {
				...cachedResponse,
				films: cachedResponse.films.map((o) => ({
					...o,
					releasedAt: new Date(o.releasedAt),
				})),
			};
		}

		const result = await findFilmsQuery(search);
		storage.set(cacheKey, result);

		return result;
	});
