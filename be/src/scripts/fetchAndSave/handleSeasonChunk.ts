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
	seasonNumber: number;
}

// kinda wasteful
const collectShowIdSeasonNumberPairs = async (chunkIds: number[]) => {
	const showIdSeasonNumberPairs: ShowIdSeasonId[] = [];

	await processLineByLine(getPath('tv'), (line) => {
		const media: ShowResponse = JSON.parse(line);
		const pairs = media.seasons.map((season) => ({
			showId: media.id,
			seasonNumber: season.season_number,
		}));

		showIdSeasonNumberPairs.push(...pairs);
	});

	return showIdSeasonNumberPairs.filter((ids) => chunkIds.includes(ids.showId));
};

const toSeason = async ({ showId, seasonNumber }: ShowIdSeasonId) =>
	getSeason(showId, seasonNumber);

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

	const showIdSeasonNumberPairs = await collectShowIdSeasonNumberPairs(ids);

	const _seasons = await pMap(showIdSeasonNumberPairs, toSeason, TMDB_OPTIONS);
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
