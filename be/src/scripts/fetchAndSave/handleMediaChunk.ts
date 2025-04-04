import { appendFile } from 'node:fs/promises';
import pMap from 'p-map';
import { TMDB_OPTIONS } from '../../services/tmdb/constants.js';
import { tmdb } from '../../services/tmdb/index.js';
import type { MediaResponse } from '../../services/tmdb/types/responses.js';
import { MIN_VOTES } from '../constants.js';
import { getPath } from '../utils.js';
import {
	filterCredits,
	trimCredits,
	trimSeasons,
	trimWatchProviders,
} from './utils.js';

const trim = (media: MediaResponse) => ({
	...media,
	credits: trimCredits(media.credits),
	'watch/providers': trimWatchProviders(media),
	seasons: trimSeasons(media),
});

const isValid = (m: MediaResponse) => {
	const isValidGeneral =
		m.credits.cast.length > 0 &&
		m.genres.length > 0 &&
		!!m.overview &&
		!!m.poster_path &&
		m.vote_count >= MIN_VOTES;

	const isValidForMediaType =
		'title' in m
			? !!m.credits?.crew.find((c) => c.job === 'Director')?.name?.length &&
				!!m.imdb_id &&
				!!m.release_date &&
				!!m.releases &&
				!!m.runtime
			: !!m.content_ratings?.results.find((r) => r.iso_3166_1 === 'US' && r.rating);

	return isValidGeneral && isValidForMediaType;
};

export const handleMediaChunk = async (
	ids: number[],
	i: number,
	type: 'movie' | 'tv',
) => {
	const path = getPath(type);
	const handleId = async (id: number) => {
		return type === 'movie'
			? tmdb.getMovie(id)
			: type === 'tv'
				? tmdb.getShow(id)
				: tmdb.getPerson(id);
	};

	const _media = await pMap(ids, handleId, TMDB_OPTIONS);
	const media = _media
		.filter((media): media is MediaResponse => media !== undefined)
		.map((media) => ({ ...media, credits: filterCredits(media.credits) })) // removed credits may affect isValid check below
		.filter(isValid)
		.map(trim)
		.map((media) => JSON.stringify(media));

	if (media.length > 0) {
		if (i !== 0) {
			await appendFile(path, '\n');
		}
		await appendFile(path, media.join('\n'));
	}
};
