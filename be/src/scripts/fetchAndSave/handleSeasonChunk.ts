import type { SeasonResponse } from '@ehicks05/tmdb-api';
import pMap from 'p-map';
import { tmdb } from '~/services/tmdb.js';
import { seasonAppends } from '../types.js';
import { collectSeasonIds } from './collectSeasonIds.js';
import { filterCredits, trimCredits } from './utils.js';

interface ShowIdSeasonNumber {
	showId: number;
	seasonNumber: number;
}

const trim = (season: SeasonResponse) => ({
	...season,
	episodes: undefined,
	'watch/providers': undefined,
	credits: trimCredits(season.credits),
});

type ModdedSeason = SeasonResponse & { showId: number };

export const handleSeasonChunk = async (showIds: number[]) => {
	const showIdSeasonNumberPairs = await collectSeasonIds(showIds);

	const _seasons = await pMap(
		showIdSeasonNumberPairs,
		async ({ showId, seasonNumber }: ShowIdSeasonNumber) => {
			const season = await tmdb.season({
				showId,
				seasonNumber,
				appends: seasonAppends,
			});
			return { ...season, showId };
		},
	);

	const seasons = _seasons
		.filter((season): season is ModdedSeason => season !== undefined)
		.map((season) => ({ ...season, credits: filterCredits(season.credits) }))
		.map((season) => ({ ...season, episode_count: season.episodes.length }))
		.map(trim)
		.map((season) => JSON.stringify(season));

	return seasons;
};
