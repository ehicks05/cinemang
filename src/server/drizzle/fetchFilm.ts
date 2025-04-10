import { createServerFn } from '@tanstack/react-start';
import { db } from './db/drizzle';

export type FilmDetail = NonNullable<Awaited<ReturnType<typeof fetchFilm>>>;

export const fetchFilm = createServerFn()
	.validator((data: { id: number }) => data)
	.handler(async (ctx) => {
		const { id } = ctx.data;

		return db.query.movie.findFirst({
			where: { id },
			with: {
				providers: { columns: { providerId: true } },
				credits: { with: { person: true } },
			},
		});
	});
