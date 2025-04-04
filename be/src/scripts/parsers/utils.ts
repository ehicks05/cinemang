import { z } from 'zod';
import { CastCreditSchema, CreditsSchema } from '~/services/tmdb/types/credits.js';
import { GenreSchema } from '~/services/tmdb/types/genre.js';
import { MovieResponseSchema } from '~/services/tmdb/types/movie.js';
import {
	ContentRatingsSchema,
	ShowResponseSchema,
} from '~/services/tmdb/types/show.js';
import { MIN_VOTES } from '../constants.js';

const ValidMediaSchema = z.object({
	credits: z.object({ cast: z.array(CastCreditSchema).nonempty() }),
	genres: z.array(GenreSchema).nonempty(),
	overview: z.string().nonempty(),
	poster_path: z.string().nonempty(),
	vote_count: z.number().gte(MIN_VOTES),
});

export const ValidMovieSchema = MovieResponseSchema.merge(ValidMediaSchema).extend({
	credits: CreditsSchema.refine((credits) => {
		const directorNameLength =
			credits.crew.find((c) => c.job === 'Director')?.name.length || 0;
		return directorNameLength > 0;
	}),
	imdb_id: z.string().nonempty(),
	release_date: z.string().date(),
	// releases: ReleasesSchema.extend.releases.nonempty(),
	runtime: z.number().positive(),
});

export const ValidShowSchema = ShowResponseSchema.merge(ValidMediaSchema).extend({
	content_ratings: ContentRatingsSchema.shape.content_ratings.refine((ratings) => {
		const result = ratings?.results.find((r) => r.iso_3166_1 === 'US' && r.rating);
		return result !== undefined;
	}),
});
