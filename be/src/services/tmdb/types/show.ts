import { z } from 'zod';
import { NetworkSchema } from './company.js';
import { CreditsSchema } from './credits.js';
import { MediaImagesSchema } from './images.js';
import { MediaSchema } from './media.js';
import { CreatorSchema } from './person.js';
import { AppendedProvidersSchema } from './provider.js';
import { EpisodeSchema, SeasonSummarySchema } from './season.js';

export const ShowStatusEnum = z.enum([
	'Returning Series',
	'Planned',
	'In Production',
	'Ended',
	'Canceled',
	'Pilot',
]);
export type ShowStatusEnum = z.infer<typeof ShowStatusEnum>;

export const ShowTypeEnum = z.nativeEnum({
	Documentary: 0,
	News: 1,
	Miniseries: 2,
	Reality: 3,
	Scripted: 4,
	TalkShow: 5,
	Video: 6,
} as const);
export type ShowTypeEnum = z.infer<typeof ShowTypeEnum>;

export const ShowSchema = MediaSchema.extend({
	created_by: z.array(CreatorSchema),
	episode_run_time: z.array(z.number()),
	first_air_date: z.string(),
	in_production: z.boolean(),
	languages: z.array(z.string()),
	last_air_date: z.string().nullable(),
	last_episode_to_air: EpisodeSchema.partial().nullable(),
	name: z.string(),
	next_episode_to_air: EpisodeSchema.partial().nullable(),
	networks: z.array(NetworkSchema),
	number_of_episodes: z.number(),
	number_of_seasons: z.number(),
	origin_country: z.array(z.string()),
	original_name: z.string(),
	seasons: z.array(SeasonSummarySchema),
	status: ShowStatusEnum,
	type: ShowTypeEnum,
});
export type Show = z.infer<typeof ShowSchema>;

export const ContentRatingsSchema = z.object({
	content_ratings: z.object({
		results: z.array(
			z.object({
				descriptors: z.array(z.unknown()),
				iso_3166_1: z.string(),
				rating: z.string(),
			}),
		),
	}),
});
export type ContentRatings = z.infer<typeof ContentRatingsSchema>;

export const ShowResponseSchema = ShowSchema.merge(MediaImagesSchema)
	.merge(AppendedProvidersSchema)
	.merge(CreditsSchema)
	.merge(ContentRatingsSchema);
export type ShowResponse = z.infer<typeof ShowResponseSchema>;
