import 'dotenv/config';
import logger from '~/services/logger.js';
import type { ShowResponse } from '~/services/tmdb/types/responses.js';
import { processLineByLine } from '../processLineByLine.js';
import { getPath } from '../utils.js';

export const collectShowIds = async () => {
	logger.info('mapping shows to showIds');

	const showIds: number[] = [];

	await processLineByLine(getPath('tv'), (line) => {
		const media: ShowResponse = JSON.parse(line);
		showIds.push(media.id);
	});

	logger.info('done mapping shows to showIds');

	return showIds;
};
