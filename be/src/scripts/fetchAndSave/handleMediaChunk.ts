import { appendFile } from 'node:fs/promises';
import pMap from 'p-map';
import { TMDB_OPTIONS } from '../../services/tmdb/constants.js';
import {
	getMovie,
	getPerson,
	getShow,
} from '../../services/tmdb/simple_endpoints.js';
import type { MediaResponse } from '../../services/tmdb/types/responses.js';
import { getPath } from '../utils.js';

const filterCredits = (media: MediaResponse) => ({
	...media,
	credits: {
		cast: media.credits.cast.filter((credit) => credit.profile_path !== null),
		crew: media.credits.crew.filter((credit) => credit.profile_path !== null),
	},
});

/**
 * Remove unused fields
 */
const trim = (media: MediaResponse) => ({
	...media,
	credits: {
		cast: media.credits.cast.map((credit) => {
			const { id, character, order, credit_id, name, ...rest } = credit;
			return { id, character, order, credit_id, name };
		}),
		crew: media.credits.crew.map((credit) => {
			const { id, job, department, credit_id, name, ...rest } = credit;
			return { id, job, department, credit_id, name };
		}),
	},
	'watch/providers': {
		results: {
			US: {
				flatrate:
					media['watch/providers'].results.US?.flatrate?.map((provider) => ({
						provider_id: provider.provider_id,
					})) || [],
			},
		},
	},
});

const MIN_VOTES = 64;

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
	type: 'movie' | 'tv' | 'person',
) => {
	const path = getPath(type);
	const handleId = async (id: number) => {
		return type === 'movie'
			? getMovie(id)
			: type === 'tv'
				? getShow(id)
				: getPerson(id);
	};

	const _media = await pMap(ids, handleId, TMDB_OPTIONS);
	const media = _media
		.filter((media): media is MediaResponse => media !== undefined)
		.map(filterCredits) // removed credits may affect isValid check below
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
