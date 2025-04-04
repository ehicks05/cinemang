import { z } from 'zod';
import { CreditsMergeSchema } from './credits.js';
import { MediaImagesSchema } from './images.js';
import { MediaSchema } from './media.js';
import { AppendedProvidersSchema } from './provider.js';

export const MovieStatusEnum = z.enum([
	'Rumored',
	'Planned',
	'In Production',
	'Post Production',
	'Released',
	'Canceled',
]);
export type MovieStatusEnum = z.infer<typeof MovieStatusEnum>;

export const CollectionSchema = z.object({
	id: z.number(),
	name: z.string(),
	overview: z.string().nullable(),
	poster_path: z.string().nullable(),
	backdrop_path: z.string().nullable(),
});
export type Collection = z.infer<typeof CollectionSchema>;

export const MovieSchema = MediaSchema.extend({
	belongs_to_collection: CollectionSchema.nullable(),
	budget: z.number(),
	imdb_id: z.string().nullable(),
	original_title: z.string(),
	release_date: z.string(),
	revenue: z.number(),
	runtime: z.number().nullable(),
	status: MovieStatusEnum,
	title: z.string(),
	video: z.boolean(),
});
export type Movie = z.infer<typeof MovieSchema>;

export const ReleasesSchema = z.object({
	countries: z.array(
		z.object({
			certification: z.string(),
			iso_3166_1: z.string(),
			primary: z.boolean(),
			release_date: z.string(),
		}),
	),
});
export type Releases = z.infer<typeof ReleasesSchema>;

const ReleasesMergeSchema = z.object({
	releases: ReleasesSchema,
});

export const MovieResponseSchema = MovieSchema.merge(MediaImagesSchema)
	.merge(AppendedProvidersSchema)
	.merge(CreditsMergeSchema)
	.merge(ReleasesMergeSchema);
export type MovieResponse = z.infer<typeof MovieResponseSchema>;
