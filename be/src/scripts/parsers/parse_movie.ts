import type { Prisma } from '@prisma/client';
import type { MovieResponse } from '~/services/tmdb/types/responses.js';
import { isValid } from './utils.js';

export const parseMovie = (data: MovieResponse) => {
	if (!isValid(data)) {
		return undefined;
	}

	const create: Prisma.MovieCreateInput = {
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
		imdbId: data.imdb_id as string,
		releasedAt: new Date(data.release_date),
		languageId: data.original_language,
		overview: data.overview,
		popularity: data.popularity,
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		posterPath: data.poster_path!,
		// biome-ignore lint/style/noNonNullAssertion: <explanation>
		runtime: data.runtime!,
		title: data.title,
		voteCount: data.vote_count,
		voteAverage: data.vote_average,
	};
	return create;
};
