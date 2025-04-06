import { appendFile, rename } from 'node:fs/promises';
import { chunk } from 'lodash-es';
import pMap from 'p-map';
import logger from '~/services/logger.js';
import { tmdb } from '../../services/tmdb/index.js';
import type { FileType } from '../types.js';
import { consoleLogInPlace } from '../utils.js';
import { collectPersonIds } from './collectPersonIds.js';
import { collectShowIds } from './collectShowIds.js';
import { handleMediaChunk } from './handleMediaChunk.js';
import { handlePersonChunk } from './handlePersonChunk.js';
import { handleSeasonChunk } from './handleSeasonChunk.js';
import { prepFiles } from './prepFiles.js';

export const fetchAndSave = async (isFullMode: boolean, type: FileType) => {
	const { path, tempPath, isFresh } = await prepFiles(type);
	if (isFresh) {
		return;
	}

	logger.info(`gathering ${type} ids`);

	const ids =
		type === 'person'
			? await collectPersonIds()
			: type === 'season'
				? await collectShowIds()
				: await tmdb.discoverMediaIds(type, isFullMode);
	const chunks = chunk(ids, 500);

	logger.info(`gathered ${ids.length} ids. fetching and saving objects`);

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

	logger.info(`done fetching ${type}s`);
	process.stdout.write('\n'); // end the line
};
