import 'dotenv/config';
import { existsSync } from 'node:fs';
import { stat, truncate } from 'node:fs/promises';
import { subHours } from 'date-fns';
import { chunk } from 'lodash-es';
import pMap from 'p-map';
import logger from '~/services/logger.js';
import { tmdb } from '../../services/tmdb/index.js';
import { isFullMode } from '../constants.js';
import type { FileType } from '../types.js';
import { consoleLogInPlace, getPath } from '../utils.js';
import { collectPersonIds } from './collectPersonIds.js';
import { collectShowIds } from './collectShowIds.js';
import { handleMediaChunk } from './handleMediaChunk.js';
import { handlePersonChunk } from './handlePersonChunk.js';
import { handleSeasonChunk } from './handleSeasonChunk.js';

const fetchAndSaveByType = async (reuseFile: boolean, type: FileType) => {
	logger.info(`fetching all ${type}s`);
	const path = getPath(type);
	const exists = existsSync(path);

	if (exists) {
		const stats = await stat(path);
		const isFresh = stats.mtime >= subHours(new Date(), 24);
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
			: type === 'season'
				? await collectShowIds()
				: await tmdb.discoverMediaIds(type, isFullMode);
	const chunks = chunk(ids, 500);

	await pMap(
		chunks,
		async (chunk, i) => {
			consoleLogInPlace(`chunk ${i + 1} of ${chunks.length}`);

			type === 'person'
				? await handlePersonChunk(chunk, i, type)
				: type === 'season'
					? await handleSeasonChunk(chunk, i, type)
					: await handleMediaChunk(chunk, i, type);
		},
		{ concurrency: 1 },
	);

	process.stdout.write('\n'); // end the line
	logger.info(`done fetching all ${type}s`);
};

export const fetchAndSave = async (reuseFile: boolean) => {
	await fetchAndSaveByType(reuseFile, 'movie');
	await fetchAndSaveByType(reuseFile, 'tv');
	await fetchAndSaveByType(reuseFile, 'season'); // depends on tv
	await fetchAndSaveByType(reuseFile, 'person'); // depends on movie, tv, and season
};
