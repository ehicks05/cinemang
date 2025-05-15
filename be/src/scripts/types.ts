import {
	AppendedProvidersSchema,
	ContentRatingsSchema,
	CreditsSchema,
	type MovieAppends,
	MovieSchema,
	type Person,
	ReleasesSchema,
	type SeasonAppends,
	SeasonSchema,
	type ShowAppends,
	ShowSchema,
} from '@ehicks05/tmdb-api';
import type { z } from 'zod/v4';

export const movieAppends: MovieAppends = {
	credits: true,
	releases: true,
	'watch/providers': true,
} as const;

export const MovieResponseSchema = MovieSchema.extend({
	credits: CreditsSchema.required(),
	releases: ReleasesSchema.required(),
	'watch/providers': AppendedProvidersSchema.required(),
});
export type MovieResponse = z.infer<typeof MovieResponseSchema>;

export const showAppends: ShowAppends = {
	content_ratings: true,
	credits: true,
	'watch/providers': true,
};

export const ShowResponseSchema = ShowSchema.extend({
	content_ratings: ContentRatingsSchema.required(),
	credits: CreditsSchema.required(),
	'watch/providers': AppendedProvidersSchema.required(),
});
export type ShowResponse = z.infer<typeof ShowResponseSchema>;

export type MediaResponse = MovieResponse | ShowResponse;

export const seasonAppends: SeasonAppends = {
	credits: true,
};

export const SeasonResponseSchema = SeasonSchema.extend({
	credits: CreditsSchema.required(),
});
export type SeasonResponse = z.infer<typeof SeasonResponseSchema>;

export type PersonResponse = Person;

export type FileType = 'movie' | 'tv' | 'season' | 'person';
