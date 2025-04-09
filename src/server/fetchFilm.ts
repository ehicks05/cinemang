import { createServerFn } from '@tanstack/react-start';
import prisma from './prisma';

export type FilmDetail = NonNullable<Awaited<ReturnType<typeof fetchFilm>>>;

export const fetchFilm = createServerFn()
	.validator((data: { id: number }) => data)
	.handler(async (ctx) => {
		const { id } = ctx.data;

		const film = await prisma.movie.findUnique({
			where: { id },
			include: {
				providers: { select: { providerId: true } },
				credits: { include: { person: true } },
			},
		});

		return film;
	});
