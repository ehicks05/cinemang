import { z } from 'zod';
import { ProductionCompanySchema } from './company.js';
import { GenreSchema } from './genre.js';
import { MovieResponseSchema, MovieStatusEnum } from './movie.js';
import { ShowResponseSchema, ShowStatusEnum } from './show.js';

export const MediaStatusEnum = z.union([MovieStatusEnum, ShowStatusEnum]);
export type MediaStatusEnum = z.infer<typeof MediaStatusEnum>;

export const LanguageSchema = z.object({
	iso_639_1: z.string(),
	english_name: z.string(),
	name: z.string(),
});
export type Language = z.infer<typeof LanguageSchema>;

export const ProductionCountrySchema = z.object({
	iso_639_1: z.string(),
	name: z.string(),
});
export type ProductionCountry = z.infer<typeof ProductionCountrySchema>;

export const MediaSchema = z.object({
	adult: z.boolean(),
	backdrop_path: z.string().nullable(),
	genres: z.array(GenreSchema),
	homepage: z.string().nullable(),
	id: z.number(),
	original_language: z.string(),
	overview: z.string(),
	popularity: z.number(),
	poster_path: z.string().nullable(),
	production_companies: z.array(ProductionCompanySchema),
	production_countries: z.array(ProductionCountrySchema),
	spoken_languages: z.array(LanguageSchema),
	status: MediaStatusEnum,
	tagline: z.string(),
	vote_average: z.number(),
	vote_count: z.number(),
});
export type Media = z.infer<typeof MediaSchema>;

export const MediaResponseSchema = z.union([
	MovieResponseSchema,
	ShowResponseSchema,
]);
export type MediaResponse = z.infer<typeof MediaResponseSchema>;
