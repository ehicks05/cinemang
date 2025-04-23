import type { Prisma } from '@prisma/client';
import z from 'zod';
import type { MovieResponse } from '../types.js';
import { ValidTrimmedMovieSchema } from './validation.js';

export const parseMovie = (
	_data: MovieResponse,
): Prisma.MovieCreateInput | undefined => {
	const { data, error } = ValidTrimmedMovieSchema.safeParse(_data);

	if (error) {
		console.log(z.prettifyError(error));
		return undefined;
	}

	return {
		id: data.id,
		cast: data.credits.cast
			.slice(0, 3)
			.map((c) => c.name)
			.join('|'),
		certification:
			data.releases.countries.find((r) => r.iso_3166_1 === 'US' && r.certification)
				?.certification || '',
		director: data.credits.crew.find((c) => c.job === 'Director')?.name || '',
		genreId: data.genres[0].id,
		imdbId: data.imdb_id,
		releasedAt: new Date(data.release_date),
		languageId: data.original_language,
		overview: data.overview,
		popularity: data.popularity,
		posterPath: data.poster_path,
		runtime: data.runtime,
		title: data.title,
		voteCount: data.vote_count,
		voteAverage: data.vote_average,
	};
};
