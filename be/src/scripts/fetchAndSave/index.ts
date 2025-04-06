import 'dotenv/config';
import { existsSync } from 'node:fs';
import { appendFile, rename, stat, truncate } from 'node:fs/promises';
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

const fetchAndSaveByType = async (type: FileType) => {
	logger.info(`fetching all ${type}s`);
	const path = getPath(type);

	if (existsSync(path)) {
		const stats = await stat(path);
		const isFresh = stats.mtime >= subHours(new Date(), 12);
		if (isFresh) {
			logger.info('skipping: file is fresh');
			return;
		}

		await truncate(path);
	}

	const tempPath = `${path}.tmp`;
	if (existsSync(tempPath)) {
		await truncate(tempPath);
	}

	logger.info('gathering ids');

	const ids =
		type === 'person'
			? await collectPersonIds()
			: type === 'season'
				? await collectShowIds()
				: await tmdb.discoverMediaIds(type, isFullMode);
	const chunks = chunk(ids, 500);

	logger.info('finished gathering ids, now fetching objects');

	await pMap(
		chunks,
		async (chunk, i) => {
			consoleLogInPlace(`chunk ${i + 1} of ${chunks.length}`);

			const media =
				type === 'person'
					? await handlePersonChunk(chunk, type)
					: type === 'season'
						? await handleSeasonChunk(chunk, type)
						: await handleMediaChunk(chunk, type);

			if (media.length > 0) {
				if (i !== 0) {
					await appendFile(tempPath, '\n');
				}
				await appendFile(tempPath, media.join('\n'));
			}
		},
		{ concurrency: 1 },
	);

	rename(tempPath, path);

	logger.info(`done fetching all ${type}s`);
	process.stdout.write('\n'); // end the line
};

export const fetchAndSave = async () => {
	await fetchAndSaveByType('movie');
	await fetchAndSaveByType('tv');
	await fetchAndSaveByType('season'); // depends on tv
	await fetchAndSaveByType('person'); // depends on movie, tv, and season
};
