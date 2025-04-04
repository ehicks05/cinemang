import { z } from 'zod';
import {
	AppendedContentRatingSchema,
	AppendedImageSchema,
	AppendedImagesSchema,
	AppendedProvidersSchema,
	AppendedReleaseSchema,
	CreditsSchema,
} from './appends.js';
import {
	GenreSchema,
	MovieSchema,
	PersonSchema,
	ProviderSchema,
	RecentChangeSchema,
	SeasonSchema,
	ShowSchema,
} from './base.js';

/**
 * These types account for the way some api responses are packaged
 */

export const GenreResponseSchema = z.object({
	genres: z.array(GenreSchema),
});
export type GenreResponse = z.infer<typeof GenreResponseSchema>;

export const MovieResponseSchema = MovieSchema.merge(AppendedImagesSchema)
	.merge(AppendedProvidersSchema)
	.merge(CreditsSchema)
	.extend({
		releases: z.object({ countries: z.array(AppendedReleaseSchema) }),
	});
export type MovieResponse = z.infer<typeof MovieResponseSchema>;

export const ShowResponseSchema = ShowSchema.merge(AppendedImagesSchema)
	.merge(AppendedProvidersSchema)
	.merge(CreditsSchema)
	.extend({
		content_ratings: z.object({ results: z.array(AppendedContentRatingSchema) }),
	});
export type ShowResponse = z.infer<typeof ShowResponseSchema>;

export const MediaResponseSchema = z.union([
	MovieResponseSchema,
	ShowResponseSchema,
]);
export type MediaResponse = z.infer<typeof MediaResponseSchema>;

export const PersonResponseSchema = PersonSchema.extend({
	images: z.object({ profiles: z.array(AppendedImageSchema) }),
});
export type PersonResponse = z.infer<typeof PersonResponseSchema>;

export const RecentChangesResponseSchema = z.object({
	results: z.array(RecentChangeSchema),
	page: z.number(),
	total_pages: z.number(),
	total_results: z.number(),
});
export type RecentChangesResponse = z.infer<typeof RecentChangesResponseSchema>;

export const ProviderResponseSchema = z.object({
	results: z.array(ProviderSchema),
});
export type ProviderResponse = z.infer<typeof ProviderResponseSchema>;

export const SeasonResponseSchema = SeasonSchema.merge(CreditsSchema);
export type SeasonResponse = z.infer<typeof SeasonResponseSchema>;
