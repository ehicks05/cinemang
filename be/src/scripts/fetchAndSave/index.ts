import { appendFile, rename } from 'node:fs/promises';
import { chunk } from 'lodash-es';
import pMap from 'p-map';
import { argv } from '~/services/args.js';
import logger from '~/services/logger.js';
import type { FileType } from '../types.js';
import { consoleLogInPlace } from '../utils.js';
import { collectPersonIds } from './collectPersonIds.js';
import { collectShowIds } from './collectShowIds.js';
import { discoverMediaIds } from './discoverMediaIds.js';
import { handleMediaChunk } from './handleMediaChunk.js';
import { handlePersonChunk } from './handlePersonChunk.js';
import { handleSeasonChunk } from './handleSeasonChunk.js';
import { prepFiles } from './prepFiles.js';

const getRunForIds = (type: FileType) => {
	const [runForType, idsRaw] = argv.runFor.split(':');
	if (runForType === type) {
		return idsRaw.split(',').map(Number);
	}

	// if running for one type, skip the other type
	return [];
};

const getIds = async (type: FileType, isFullMode: boolean) => {
	// hacky: override to sync specific movies/shows
	if (argv.runFor && ['movie', 'tv'].includes(type)) {
		const runForIds = getRunForIds(type);
		return runForIds;
	}

	let ids: number[] = [];

	if (type === 'movie' || type === 'tv') {
		ids = await discoverMediaIds(type, isFullMode);
	}
	if (type === 'season') {
		ids = await collectShowIds();
	}
	if (type === 'person') {
		ids = await collectPersonIds(isFullMode);
	}

	return ids;
};

const handleChunks = async (
	chunks: number[][],
	type: FileType,
	tempPath: string,
) => {
	await appendFile(tempPath, ''); // make sure it exists

	await pMap(
		chunks,
		async (chunk, i) => {
			consoleLogInPlace(`chunk ${i + 1} of ${chunks.length}`);

			const media =
				type === 'person'
					? await handlePersonChunk(chunk)
					: type === 'season'
						? await handleSeasonChunk(chunk)
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
};

export const fetchAndSave = async (isFullMode: boolean, type: FileType) => {
	const { path, tempPath, isFresh } = await prepFiles(type);
	if (isFresh) {
		return;
	}

	logger.info(`gathering ${type} ids`);
	const ids = await getIds(type, isFullMode);
	const chunks = chunk(ids, 500);
	logger.info(`gathered ${ids.length} ids. fetching and saving`);

	await handleChunks(chunks, type, tempPath);

	await rename(tempPath, path);

	logger.info(`done fetching ${type}s`);
	process.stdout.write('\n'); // end the line
};
