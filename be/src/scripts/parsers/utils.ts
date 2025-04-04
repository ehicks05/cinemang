import type { MediaResponse } from '~/services/tmdb/types/media.js';
import { MIN_VOTES } from '../constants.js';

export const isValid = (m: MediaResponse) => {
	const isValidGeneral =
		m.credits.cast.length > 0 &&
		m.genres.length > 0 &&
		!!m.overview?.length &&
		!!m.poster_path?.length &&
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
