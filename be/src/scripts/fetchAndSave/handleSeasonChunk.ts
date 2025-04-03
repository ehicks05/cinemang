import { appendFile } from 'node:fs/promises';
import pMap from 'p-map';
import { TMDB_OPTIONS } from '../../services/tmdb/constants.js';
import { getSeason } from '../../services/tmdb/simple_endpoints.js';
import type {
	SeasonResponse,
	ShowResponse,
} from '../../services/tmdb/types/responses.js';
import { processLineByLine } from '../processLineByLine.js';
import { getPath } from '../utils.js';
import { filterCredits, trimCredits } from './utils.js';

interface ShowIdSeasonId {
	showId: number;
	seasonId: number;
}

// kinda wasteful
const collectShowIdSeasonIdPairs = async (chunkIds: number[]) => {
	const showIdSeasonIdPairs: ShowIdSeasonId[] = [];

	await processLineByLine(getPath('tv'), (line) => {
		const media: ShowResponse = JSON.parse(line);
		const pairs = media.seasons.map((season) => ({
			showId: media.id,
			seasonId: season.id,
		}));

		showIdSeasonIdPairs.push(...pairs);
	});

	return showIdSeasonIdPairs.filter((ids) => chunkIds.includes(ids.showId));
};

const toSeason = async ({ showId, seasonId }: ShowIdSeasonId) =>
	getSeason(showId, seasonId);

const trim = (season: SeasonResponse) => ({
	...season,
	episodes: undefined,
	'watch/providers': undefined,
	credits: trimCredits(season.credits),
});

export const handleSeasonChunk = async (
	ids: number[],
	i: number,
	type: 'season',
) => {
	const path = getPath(type);

	const showIdSeasonIdPairs = await collectShowIdSeasonIdPairs(ids);

	const _seasons = await pMap(showIdSeasonIdPairs, toSeason, TMDB_OPTIONS);
	const seasons = _seasons
		.filter((season): season is SeasonResponse => season !== undefined)
		.map((season) => ({ ...season, credits: filterCredits(season.credits) }))
		.map((season) => ({ ...season, episode_count: season.episodes.length }))
		.map(trim)
		.map((season) => JSON.stringify(season));

	if (seasons.length > 0) {
		if (i !== 0) {
			await appendFile(path, '\n');
		}
		await appendFile(path, seasons.join('\n'));
	}
};
