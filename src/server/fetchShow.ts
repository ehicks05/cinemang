import { createServerFn } from '@tanstack/react-start';
import { db } from './db/drizzle';

export type ShowDetail = NonNullable<Awaited<ReturnType<typeof fetchShow>>>;

export const fetchShow = createServerFn()
	.validator((data: { id: number }) => data)
	.handler(async (ctx) => {
		const { id } = ctx.data;

		return db.query.show.findFirst({
			where: { id },
			with: {
				providers: { columns: { providerId: true } },
				credits: { with: { person: true } },
				seasons: true,
			},
		});
	});
