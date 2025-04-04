import { z } from 'zod';

export const ImageSchema = z.object({
	aspect_ratio: z.number(),
	file_path: z.string(),
	height: z.number(),
	iso_639_1: z.string().nullable(),
	vote_average: z.number(),
	vote_count: z.number(),
	width: z.number(),
});
export type Image = z.infer<typeof ImageSchema>;

export const MediaImagesSchema = z.object({
	images: z.object({
		backdrops: z.array(ImageSchema),
		logos: z.array(ImageSchema),
		posters: z.array(ImageSchema),
	}),
});
export type MediaImages = z.infer<typeof MediaImagesSchema>;

export const PersonImagesSchema = z.object({
	images: z.object({
		profiles: z.array(ImageSchema),
	}),
});
export type PersonImages = z.infer<typeof PersonImagesSchema>;
