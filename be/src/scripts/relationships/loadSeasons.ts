import type { Prisma } from '@prisma/client';
import logger from '~/services/logger.js';
import prisma from '~/services/prisma.js';
import type { SeasonResponse, SeasonSummary } from '~/services/tmdb/types/season.js';
import { processLines } from '../processLineByLine.js';
import { getPath } from '../utils.js';

const toSeasonCreateInput = (
	o: SeasonSummary & { showId: number },
): Prisma.SeasonUncheckedCreateInput => ({
	id: o.id,
	showId: o.showId,
	airDate: o.air_date ? new Date(o.air_date) : undefined,
	episodeCount: o.episode_count,
	name: o.name,
	overview: o.overview,
	posterPath: o.poster_path,
	seasonNumber: o.season_number,
	voteAverage: o.vote_average,
});

// hack, need to handle upstream
export type ModdedSeason = SeasonResponse & {
	showId: number;
	episode_count: number;
};

export const loadSeasons = async () => {
	logger.info('droploading seasons');

	await processLines(
		getPath('season'),
		async (chunk) => {
			const data = chunk
				.map((line) => JSON.parse(line) as ModdedSeason)
				.map(toSeasonCreateInput);

			try {
				const ids = data.map((o) => o.id);
				await prisma.season.deleteMany({ where: { id: { in: ids } } });
				await prisma.season.createMany({ data });
			} catch (e) {
				logger.error(e);
			}
		},
		500,
	);

	logger.info('finished droploading seasons');
};
