import { z } from 'zod';
import {
	CastCreditSchema,
	CrewCreditSchema,
} from '~/services/tmdb/types/credits.js';
import { GenreSchema } from '~/services/tmdb/types/genre.js';
import { MovieResponseSchema } from '~/services/tmdb/types/movie.js';
import {
	ContentRatingsSchema,
	ShowResponseSchema,
} from '~/services/tmdb/types/show.js';
import { MIN_VOTES } from '../constants.js';

const TrimmedCastCreditSchema = CastCreditSchema.pick({
	id: true,
	credit_id: true,
	name: true,
	character: true,
	order: true,
});

const TrimmedCrewCreditSchema = CrewCreditSchema.pick({
	id: true,
	credit_id: true,
	name: true,
	job: true,
	department: true,
});

export const TrimmedCreditsSchema = z.object({
	cast: z.array(TrimmedCastCreditSchema).nonempty({ message: 'cast is empty' }),
	crew: z.array(TrimmedCrewCreditSchema),
});

const ValidMediaSchema = z.object({
	credits: TrimmedCreditsSchema,
	genres: z.array(GenreSchema).nonempty({ message: 'genres is empty' }),
	overview: z.string().nonempty({ message: 'overview is empty' }),
	poster_path: z
		.string({ message: 'poster_path is empty' })
		.nonempty({ message: 'poster_path is empty' }),
	vote_count: z.number().gte(MIN_VOTES),
});

export const ValidMovieSchema = MovieResponseSchema.merge(ValidMediaSchema).extend({
	credits: TrimmedCreditsSchema.refine(
		(credits) => {
			const directorNameLength =
				credits.crew.find((c) => c.job === 'Director')?.name.length || 0;
			return directorNameLength > 0;
		},
		{ message: 'director is missing' },
	),
	imdb_id: z
		.string({ message: 'poster_path is empty' })
		.nonempty({ message: 'imdb_id is empty' }),
	release_date: z.string().date(),
	// releases: ReleasesSchema.extend.releases.nonempty(),
	runtime: z.number().positive({ message: 'runtime is 0' }),
});

export const ValidShowSchema = ShowResponseSchema.merge(ValidMediaSchema).extend({
	content_ratings: ContentRatingsSchema.shape.content_ratings.refine(
		(ratings) => {
			const result = ratings?.results.find((r) => r.iso_3166_1 === 'US' && r.rating);
			return result !== undefined;
		},
		{ message: 'US content rating is missing' },
	),
});

// HACKY
const TrimmedWatchProvidersSchema = z.object({
	'watch/providers': z.object({
		results: z.record(
			z.string(),
			z.object({
				flatrate: z.array(z.object({ provider_id: z.number() })).optional(),
			}),
		),
	}),
});

export const ValidTrimmedMovieSchema = ValidMovieSchema.merge(
	TrimmedWatchProvidersSchema,
);
export const ValidTrimmedShowSchema = ValidShowSchema.merge(
	TrimmedWatchProvidersSchema,
);
