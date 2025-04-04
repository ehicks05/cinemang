import 'dotenv/config';
import logger from '~/services/logger.js';
import type { Credits } from '~/services/tmdb/types/credits.js';
import { processLineByLine } from '../processLineByLine.js';
import { getPath } from '../utils.js';

const mediaToPersonIds = (line: string) => {
	const media: { credits: Credits } = JSON.parse(line);
	const castPersonIds = media.credits.cast.map((credit) => credit.id);
	const crewPersonIds = media.credits.crew.map((credit) => credit.id);
	return castPersonIds.concat(crewPersonIds);
};

export const collectPersonIds = async () => {
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
	logger.info(`found ${personIds.length} unique personIds`);

	logger.info('done mapping medias to personids');

	return personIds;
};
