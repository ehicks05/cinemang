import {
	CastCreditSchema,
	ContentRatingsSchema,
	CrewCreditSchema,
	GenreSchema,
	PersonSchema,
} from '@ehicks05/tmdb-api';
import { z } from 'zod';
import { MIN_VOTES } from '../constants.js';
import { MovieResponseSchema, ShowResponseSchema } from '../types.js';

export const TrimmedCreditsSchema = z.object({
	cast: z
		.array(
			CastCreditSchema.pick({
				id: true,
				credit_id: true,
				name: true,
				character: true,
				order: true,
			}),
		)
		.nonempty({ message: 'cast is empty' }),
	crew: z.array(
		CrewCreditSchema.pick({
			id: true,
			credit_id: true,
			name: true,
			job: true,
			department: true,
		}),
	),
});

const ValidMediaSchema = z.object({
	credits: TrimmedCreditsSchema,
	genres: z.array(GenreSchema).nonempty({ message: 'genres is empty' }),
	overview: z.string().nonempty({ message: 'overview is empty' }),
	poster_path: z
		.string({ message: 'poster_path is not string' })
		.nonempty({ message: 'poster_path is empty' }),
	vote_count: z.number().gte(MIN_VOTES),
});

export const ValidMovieSchema = MovieResponseSchema.extend(ValidMediaSchema).extend({
	credits: TrimmedCreditsSchema.refine(
		(credits) => {
			const directorNameLength =
				credits.crew.find((c) => c.job === 'Director')?.name.length || 0;
			return directorNameLength > 0;
		},
		{ message: 'director is missing' },
	),
	imdb_id: z
		.string({ message: 'imdb_id is not string' })
		.nonempty({ message: 'imdb_id is empty' }),
	release_date: z.iso.date(),
	// releases: ReleasesSchema.extend.releases.nonempty(),
	runtime: z.number().positive({ message: 'runtime is 0' }),
});

export const ValidShowSchema = ShowResponseSchema.extend(ValidMediaSchema).extend({
	content_ratings: ContentRatingsSchema.refine(
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

export const ValidTrimmedMovieSchema = ValidMovieSchema.extend(
	TrimmedWatchProvidersSchema,
);
export const ValidTrimmedShowSchema = ValidShowSchema.extend(
	TrimmedWatchProvidersSchema,
);

export const ValidPersonSchema = PersonSchema.extend({
	known_for_department: z.string({ message: 'missing known_for_department' }),
});
