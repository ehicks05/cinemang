import { createServerFn } from '@tanstack/react-start';
import prisma from './prisma';

export type ShowDetail = NonNullable<Awaited<ReturnType<typeof fetchShow>>>;

export const fetchShow = createServerFn()
	.validator((data: { id: number }) => data)
	.handler(async (ctx) => {
		const { id } = ctx.data;

		const film = await prisma.show.findUnique({
			where: { id },
			include: {
				providers: { select: { providerId: true } },
				credits: { include: { person: true } },
				seasons: true,
			},
		});

		return film;
	});
