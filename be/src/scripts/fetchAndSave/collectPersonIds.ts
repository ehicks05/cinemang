import type { Credits } from '@ehicks05/tmdb-api';
import logger from '~/services/logger.js';
import prisma from '~/services/prisma.js';
import { processLineByLine } from '../processLineByLine.js';
import { getPath } from '../utils.js';

const mediaToPersonIds = (line: string) => {
	const media: { credits: Credits } = JSON.parse(line);
	const castPersonIds = media.credits.cast.map((credit) => credit.id);
	const crewPersonIds = media.credits.crew.map((credit) => credit.id);
	return castPersonIds.concat(crewPersonIds);
};

export const collectPersonIds = async (isFullMode: boolean) => {
	logger.info('mapping medias to personids');

	const _personIds: number[] = [];

	await processLineByLine(getPath('movie'), (line, i) => {
		const mediaPersonIds = mediaToPersonIds(line);
		_personIds.push(...mediaPersonIds);
	});

	await processLineByLine(getPath('tv'), (line, i) => {
		const mediaPersonIds = mediaToPersonIds(line);
		_personIds.push(...mediaPersonIds);
	});

	await processLineByLine(getPath('season'), (line, i) => {
		const mediaPersonIds = mediaToPersonIds(line);
		_personIds.push(...mediaPersonIds);
	});

	const personIds = [...new Set(_personIds)];

	if (isFullMode) {
		logger.info(`found ${personIds.length} unique personIds`);
		return personIds;
	}

	const idsInDb = (await prisma.person.findMany({ select: { id: true } })).map(
		(person) => person.id,
	);
	const newPersonIds = personIds.filter((personId) => !idsInDb.includes(personId));

	logger.info(`found ${newPersonIds.length} new, unique personIds`);
	return newPersonIds;
};
