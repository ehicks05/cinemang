import { createServerFn } from '@tanstack/react-start';
import type { MovieSearchForm } from '~/utils/searchParams/types';
import { type FindFilmsReturn, findFilmsQuery } from './findFilmsQuery';
import { storage } from './storage';

export const findFilms = createServerFn()
	.validator((data: MovieSearchForm) => data)
	.handler(async (ctx) => {
		const start = Date.now();

		const cachedResponse = await storage.get<FindFilmsReturn>(
			JSON.stringify(ctx.data),
		);
		if (cachedResponse) {
			const result = {
				films: cachedResponse.films.map((o) => ({
					...o,
					releasedAt: new Date(o.releasedAt),
				})),
				hasMore: cachedResponse.hasMore,
			};

			console.log(`[HIT] took ${Date.now() - start} ms`);
			return result;
		}

		const result = await findFilmsQuery(ctx.data);
		storage.set(JSON.stringify(ctx.data), result);
		console.log(`[MISS] took ${Date.now() - start} ms`);

		return result;
	});
