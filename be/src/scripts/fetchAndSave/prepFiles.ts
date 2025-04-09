import { existsSync } from 'node:fs';
import { stat, truncate } from 'node:fs/promises';
import { subHours } from 'date-fns';
import logger from '~/services/logger.js';
import type { FileType } from '../types.js';
import { getPath } from '../utils.js';

const checkFreshness = async (path: string) => {
	const exists = existsSync(path);

	if (exists) {
		const stats = await stat(path);
		const isFresh = stats.mtime >= subHours(new Date(), 12);
		return { exists, isFresh };
	}
	return { exists, isFresh: false };
};

export const prepFiles = async (type: FileType) => {
	const path = getPath(type);

	// always clear temp file
	const tempPath = `${path}.tmp`;
	if (existsSync(tempPath)) {
		await truncate(tempPath);
	}

	const { exists, isFresh } = await checkFreshness(path);
	if (exists) {
		if (isFresh) {
			logger.info(`found fresh ${type} file`);
		} else {
			await truncate(path);
		}
	}

	return { path, tempPath, isFresh };
};
