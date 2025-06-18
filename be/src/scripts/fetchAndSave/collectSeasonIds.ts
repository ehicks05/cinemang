import logger from '~/services/logger.js';
import { processLineByLine } from '../processLineByLine.js';
import type { ShowResponse } from '../types.js';
import { getPath } from '../utils.js';

interface SeasonId {
	showId: number;
	seasonNumber: number;
}

export const collectSeasonIds = async (chunkIds: number[]) => {
	logger.info('mapping shows to seasonIds');

	const seasonIds: SeasonId[] = [];

	await processLineByLine(getPath('tv'), (line) => {
		const show: ShowResponse = JSON.parse(line);
		if (chunkIds.includes(show.id)) {
			const ids = show.seasons.map((season) => ({
				showId: show.id,
				seasonNumber: season.season_number,
			}));
			seasonIds.push(...ids);
		}
	});

	logger.info(`found ${seasonIds.length} seasonIds`);
	return seasonIds;
};
