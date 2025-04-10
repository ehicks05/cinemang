import { createServerFn } from '@tanstack/react-start';
import prisma from './prisma';

export type Person = NonNullable<Awaited<ReturnType<typeof fetchPerson>>>;

export const fetchPerson = createServerFn()
	.validator((data: { id: number }) => data)
	.handler(async (ctx) => {
		const { id } = ctx.data;

		const person = await prisma.person.findUnique({
			where: { id },
			include: { credits: { include: { movie: true, show: true } } },
		});

		return person;
	});
