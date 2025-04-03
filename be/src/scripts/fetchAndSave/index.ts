import 'dotenv/config';
import { existsSync } from 'node:fs';
import { stat, truncate } from 'node:fs/promises';
import { subHours } from 'date-fns';
import { chunk } from 'lodash-es';
import pMap from 'p-map';
import logger from '~/services/logger.js';
import { discoverMediaIds } from '../../services/tmdb/discover.js';
import { isFullMode } from '../constants.js';
import { consoleLogInPlace, getPath } from '../utils.js';
import { collectPersonIds } from './collectPersonIds.js';
import { handleMediaChunk } from './handleMediaChunk.js';
import { handlePersonChunk } from './handlePersonChunk.js';

const fetchAndSaveByType = async (
	reuseFile: boolean,
	type: 'movie' | 'tv' | 'person',
) => {
	logger.info(`fetching all ${type}s`);
	const path = getPath(type);
	const exists = existsSync(path);

	if (exists) {
		const stats = await stat(path);
		const isFresh = stats.mtime >= subHours(new Date(), 6);
		if (isFresh && reuseFile) {
			logger.info('skipping due to fresh file or reuseFile=true');
			return;
		}
	}

	if (exists) {
		await truncate(path);
	}

	const ids =
		type === 'person'
			? await collectPersonIds()
			: await discoverMediaIds(type, isFullMode);
	const chunks = chunk(ids, 500);

	const handler = type === 'person' ? handlePersonChunk : handleMediaChunk;

	await pMap(
		chunks,
		async (chunk, i) => {
			consoleLogInPlace(`chunk ${i + 1} of ${chunks.length}`);
			await handler(chunk, i, type);
		},
		{ concurrency: 1 },
	);

	process.stdout.write('\n'); // end the line
	logger.info(`done fetching all ${type}s`);
};

export const fetchAndSave = async (reuseFile: boolean) => {
	await fetchAndSaveByType(reuseFile, 'movie');
	await fetchAndSaveByType(reuseFile, 'tv');
	await fetchAndSaveByType(reuseFile, 'person');
};
