import type { Prisma } from '@prisma/client';
import logger from '~/services/logger.js';
import prisma from '~/services/prisma.js';
import type { MediaResponse } from '~/services/tmdb/types/responses.js';
import { processLines } from '../processLineByLine.js';
import { getPath } from '../utils.js';

const toMediaKey = (media: MediaResponse) => {
	if ('title' in media) return { movieId: media.id };
	if ('name' in media) return { showId: media.id };
	throw new Error('unrecognized media object');
};

const toCreditCreateInput = (
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

export const loadCredits = async (type: 'movie' | 'tv') => {
	logger.info(`droploading ${type} credits`);

	const where =
		type === 'movie' ? { movieId: { not: null } } : { showId: { not: null } };
	const deleteResult = await prisma.credit.deleteMany({ where: where });

	logger.info(`dropped ${deleteResult.count} rows`);

	await processLines(
		getPath(type),
		async (chunk) => {
			const data = chunk
				.map((line) => JSON.parse(line))
				.flatMap(toCreditCreateInput)
				.filter((o) => !!o);

			const persons = await prisma.person.findMany({
				where: { id: { in: data.map((o) => o.personId) } },
			});
			const personIds = persons.map((o) => o.id);

			const creditsWithNonexistantPerson = data.filter(
				(credit) => !personIds.includes(credit.personId),
			);

			creditsWithNonexistantPerson.map((c) =>
				console.log(`movieId: ${c.movieId}, missing person: ${c.personId}`),
			);

			try {
				await prisma.credit.createMany({ data });
			} catch (e) {
				logger.error(e);
			}
		},
		500,
	);

	logger.info(`finished loading ${type} credits`);
};
