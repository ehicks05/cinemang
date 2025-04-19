import type { Prisma } from '@prisma/client';
import type { MediaResponse } from '../types.js';

const toMediaKey = (media: MediaResponse) => {
	if ('title' in media) return { movieId: media.id };
	if ('name' in media) return { showId: media.id };
	throw new Error('unrecognized media object');
};

export const toCreditCreateInput = (
	media: MediaResponse,
): Prisma.CreditUncheckedCreateInput[] => [
	...media.credits.cast.map((c) => ({
		...toMediaKey(media),
		personId: c.id,
		creditId: c.credit_id,
		character: c.character,
		order: c.order,
	})),
	...media.credits.crew.map((c) => ({
		...toMediaKey(media),
		personId: c.id,
		creditId: c.credit_id,
		department: c.department,
		job: c.job,
	})),
];
