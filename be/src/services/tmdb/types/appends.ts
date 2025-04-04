import { z } from 'zod';
import { PersonSchema, ProviderSchema } from './base.js';

/**
 * Variations of the base types that generally omit a few fields
 */

export const AppendedPersonSchema = PersonSchema.pick({
	adult: true,
	gender: true,
	id: true,
	known_for_department: true,
	name: true,
	popularity: true,
	profile_path: true,
});
export type AppendedPerson = z.infer<typeof AppendedPersonSchema>;

export const CastCreditSchema = AppendedPersonSchema.extend({
	original_name: z.string(),
	cast_id: z.number(),
	character: z.string(),
	credit_id: z.string(),
	order: z.number(),
});
export type CastCredit = z.infer<typeof CastCreditSchema>;

export const CrewCreditSchema = AppendedPersonSchema.extend({
	original_name: z.string(),
	credit_id: z.string(),
	department: z.string(),
	job: z.string(),
});
export type CrewCredit = z.infer<typeof CrewCreditSchema>;

export const CreditSchema = z.union([CastCreditSchema, CrewCreditSchema]);
export type Credit = z.infer<typeof CreditSchema>;

export const CreditsSchema = z.object({
	credits: z.object({
		cast: z.array(CastCreditSchema),
		crew: z.array(CrewCreditSchema),
	}),
});
export type Credits = z.infer<typeof CreditsSchema>;

export const AppendedImageSchema = z.object({
	aspect_ratio: z.number(),
	file_path: z.string(),
	height: z.number(),
	iso_639_1: z.string().nullable(),
	vote_average: z.number(),
	vote_count: z.number(),
	width: z.number(),
});
export type AppendedImage = z.infer<typeof AppendedImageSchema>;

export const AppendedImagesSchema = z.object({
	images: z.object({
		backdrops: z.array(AppendedImageSchema),
		logos: z.array(AppendedImageSchema),
		posters: z.array(AppendedImageSchema),
	}),
});
export type AppendedImages = z.infer<typeof AppendedImagesSchema>;

export const AppendedReleaseSchema = z.object({
	certification: z.string(),
	iso_3166_1: z.string(),
	primary: z.boolean(),
	release_date: z.string(),
});
export type AppendedRelease = z.infer<typeof AppendedReleaseSchema>;

export const AppendedContentRatingSchema = z.object({
	descriptors: z.array(z.unknown()),
	iso_3166_1: z.string(),
	rating: z.string(),
});
export type AppendedContentRating = z.infer<typeof AppendedContentRatingSchema>;

export const AppendedProviderSchema = ProviderSchema.omit({
	display_priority: true,
});
export type AppendedProvider = z.infer<typeof AppendedProviderSchema>;

export const AppendedProvidersSchema = z.object({
	'watch/providers': z.object({
		results: z.record(
			z.string(),
			z.object({
				link: z.string(),
				flatrate: z.array(AppendedProviderSchema),
				buy: z.array(AppendedProviderSchema),
				rent: z.array(AppendedProviderSchema),
			}),
		),
	}),
});
export type AppendedProviders = z.infer<typeof AppendedProvidersSchema>;
