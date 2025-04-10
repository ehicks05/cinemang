import { createServerFn } from '@tanstack/react-start';
import { db } from './db/drizzle';

export type Person = NonNullable<Awaited<ReturnType<typeof fetchPerson>>>;

export const fetchPerson = createServerFn()
	.validator((data: { id: number }) => data)
	.handler(async (ctx) => {
		const { id } = ctx.data;

		return db.query.person.findFirst({
			where: { id },
			with: { credits: { with: { movie: true, show: true } } },
		});
	});
