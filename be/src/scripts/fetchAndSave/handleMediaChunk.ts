import pMap from 'p-map';
import { tmdb } from '~/services/tmdb/index.js';
import type { MediaResponse } from '~/services/tmdb/types/media.js';
import { ValidMovieSchema, ValidShowSchema } from '../parsers/validation.js';
import {
	filterCredits,
	trimCredits,
	trimSeasons,
	trimWatchProviders,
} from './utils.js';

const EXPECTED_ISSUES = [
	'cast is empty',
	'director is missing',
	'overview is empty',
	'runtime is 0',
	'imdb_id is empty',
	'genres is empty',
	'poster_path is empty',
	'US content rating is missing',
	'missing known_for_department',
];

const trim = (media: MediaResponse) => ({
	...media,
	credits: trimCredits(media.credits),
	'watch/providers': trimWatchProviders(media),
	seasons: trimSeasons(media),
});

const isValid = (m: MediaResponse) => {
	const { data, error } =
		'title' in m ? ValidMovieSchema.safeParse(m) : ValidShowSchema.safeParse(m);

	// ignore expected issues
	const issues = error?.issues.filter(
		(issue) => !EXPECTED_ISSUES.includes(issue.message),
	);

	if (issues && issues.length > 0) {
		console.log(`error for ${m.id}`);
		console.log(issues);
	}

	return !!data;
};

export const handleMediaChunk = async (ids: number[], type: 'movie' | 'tv') => {
	const handleId = async (id: number) => {
		return type === 'movie'
			? tmdb.getMovie(id)
			: type === 'tv'
				? tmdb.getShow(id)
				: tmdb.getPerson(id);
	};

	const _media = await pMap(ids, handleId);
	const media = _media
		.filter((media): media is MediaResponse => media !== undefined)
		.map((media) => ({ ...media, credits: filterCredits(media.credits) })) // removed credits may affect isValid check below
		.filter(isValid)
		.map(trim)
		.map((media) => JSON.stringify(media));

	return media;
};
