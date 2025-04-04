import { appendFile } from 'node:fs/promises';
import pMap from 'p-map';
import type { MediaResponse } from '~/services/tmdb/types/media.js';
import { tmdb } from '../../services/tmdb/index.js';
import { ValidMovieSchema, ValidShowSchema } from '../parsers/utils.js';
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
	const { data } =
		'title' in m ? ValidMovieSchema.safeParse(m) : ValidShowSchema.safeParse(m);

	return !!data;
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

	const _media = await pMap(ids, handleId);
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
