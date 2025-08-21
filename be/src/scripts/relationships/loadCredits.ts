import type { Prisma } from '@prisma/client';
import { uniqBy } from 'es-toolkit';
import logger from '~/services/logger.js';
import prisma from '~/services/prisma.js';
import { processLines } from '../processLineByLine.js';
import type { ShowResponse } from '../types.js';
import { getPath } from '../utils.js';
import type { ModdedSeason } from './loadSeasons.js';
import { toCreditCreateInput } from './toCreateCreditInput.js';

const handleMovieChunk = async (chunk: string[]) => {
	const data = chunk
		.map((line) => JSON.parse(line))
		.flatMap(toCreditCreateInput)
		.filter((o) => !!o);

	return data;
};

const mergeSeasonCreditsIntoShow = (show: ShowResponse, seasons: ModdedSeason[]) => {
	const showSeasons = seasons.filter((season) => season.showId === show.id);
	const seasonsCasts = showSeasons.flatMap((season) => season.credits.cast);
	const seasonsCrews = showSeasons.flatMap((season) => season.credits.crew);

	const combinedCast = [...show.credits.cast, ...seasonsCasts];
	const combinedCrew = [...show.credits.crew, ...seasonsCrews];

	const showWithSeasonCredits = {
		...show,
		credits: {
			cast: uniqBy(combinedCast, (credit) => credit.credit_id),
			crew: uniqBy(combinedCrew, (credit) => credit.credit_id),
		},
	};
	return showWithSeasonCredits;
};

const handleShowChunk = async (chunk: string[]) => {
	const shows: ShowResponse[] = chunk.map((line) => JSON.parse(line));
	const showIds = shows.map((show) => show.id);
	// all seasons belonging any of the shows above
	const seasons: ModdedSeason[] = [];

	await processLines(
		getPath('season'),
		async (chunk) => {
			const showSeasons = chunk
				.map((line) => JSON.parse(line) as ModdedSeason)
				.filter((season) => showIds.includes(season.showId));

			seasons.push(...showSeasons);
		},
		500,
	);

	const _data = shows
		.map((show) => mergeSeasonCreditsIntoShow(show, seasons))
		.flatMap(toCreditCreateInput)
		.filter((o) => !!o);

	const duplicateCreditIds = await findDuplicateCreditIds(_data);
	const data = _data.filter(
		(credit) => !duplicateCreditIds.includes(credit.creditId),
	);

	return data;
};

// We're seeing the same creditId across different shows. For example creditId
// 5305003cc3a3682c960268b3 is in shows 45 and 4498 (Jeremy CLarkson in two
// versions of Top Gear).
const findDuplicateCreditIds = async (
	credits: Prisma.CreditUncheckedCreateInput[],
) => {
	const duplicateCredits = await prisma.credit.findMany({
		where: { creditId: { in: credits.map((o) => o.creditId) } },
		select: { creditId: true },
	});
	const ids = duplicateCredits.map((o) => o.creditId);

	if (ids.length > 0) logger.warn(`duplicate creditIds: ${ids.join(', ')}`);

	return ids;
};

const detectCreditsWithMissingPerson = async (
	credits: Prisma.CreditUncheckedCreateInput[],
) => {
	const persons = await prisma.person.findMany({
		select: { id: true },
		where: { id: { in: credits.map((o) => o.personId) } },
	});
	const personIds = persons.map((o) => o.id);

	const creditsWithMissingPerson = credits.filter(
		(credit) => !personIds.includes(credit.personId),
	);

	creditsWithMissingPerson.map((c) =>
		logger.warn(
			`movieId: ${c.movieId}, showId: ${c.showId}, missing person: ${c.personId}`,
		),
	);

	const creditIdsToRemove = creditsWithMissingPerson.map((c) => c.creditId);
	return credits.filter((c) => !creditIdsToRemove.includes(c.creditId));
};

export const loadCredits = async (type: 'movie' | 'tv') => {
	logger.info(`droploading ${type} credits`);

	await processLines(
		getPath(type),
		async (chunk) => {
			const _data =
				type === 'movie'
					? await handleMovieChunk(chunk)
					: await handleShowChunk(chunk);

			const data = await detectCreditsWithMissingPerson(_data);

			try {
				const _ids =
					type === 'movie' ? data.map((o) => o.movieId) : data.map((o) => o.showId);
				const ids = _ids.filter((o): o is number => !!o);
				const where =
					type === 'movie' ? { movieId: { in: ids } } : { showId: { in: ids } };

				await prisma.credit.deleteMany({ where: where });
				await prisma.credit.createMany({ data });
			} catch (e) {
				logger.error(e);
			}
		},
		400, // too high can result in errors like: too many bind variables in prepared statement, expected maximum of 32767, received 33472
	);

	logger.info(`finished droploading ${type} credits`);
};
