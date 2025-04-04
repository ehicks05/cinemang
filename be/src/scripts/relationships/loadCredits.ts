import type { Prisma } from '@prisma/client';
import { uniqBy } from 'lodash-es';
import logger from '~/services/logger.js';
import prisma from '~/services/prisma.js';
import type { ShowResponse } from '~/services/tmdb/types/show.js';
import { processLines } from '../processLineByLine.js';
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
			cast: uniqBy(combinedCast, 'creditId'),
			crew: uniqBy(combinedCrew, 'creditId'),
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
			const showSeasons: ModdedSeason[] = chunk
				.map((line) => JSON.parse(line))
				.filter((season) => showIds.includes(season.showId));

			seasons.push(...showSeasons);
		},
		500,
	);

	const data = shows
		.map((show) => mergeSeasonCreditsIntoShow(show, seasons))
		.flatMap(toCreditCreateInput)
		.filter((o) => !!o);

	return data;
};

const detectCreditsWithMissingPerson = async (
	credits: Prisma.CreditUncheckedCreateInput[],
) => {
	const persons = await prisma.person.findMany({
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

	const where =
		type === 'movie' ? { movieId: { not: null } } : { showId: { not: null } };
	const deleteResult = await prisma.credit.deleteMany({ where: where });

	logger.info(`dropped ${deleteResult.count} rows`);

	await processLines(
		getPath(type),
		async (chunk) => {
			const _data =
				type === 'movie'
					? await handleMovieChunk(chunk)
					: await handleShowChunk(chunk);

			const data = await detectCreditsWithMissingPerson(_data);

			try {
				await prisma.credit.createMany({ data });
			} catch (e) {
				logger.error(e);
			}
		},
		500,
	);

	logger.info(`finished droploading ${type} credits`);
};
