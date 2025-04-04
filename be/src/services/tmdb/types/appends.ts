import { z } from 'zod';
import { PersonSchema, type Provider } from './base.js';

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

export interface AppendedImage {
	aspect_ratio: number;
	file_path: string;
	file_type?: '.svg' | '.png';
	height: number;
	iso_639_1?: string;
	vote_average: number;
	vote_count: number;
	width: number;
}

export interface AppendedImages {
	images: {
		backdrops: AppendedImage[];
		logos: AppendedImage[];
		posters: AppendedImage[];
	};
}

export interface AppendedRelease {
	certification: string;
	iso_3166_1: string;
	primary: boolean;
	release_date: string;
}

export interface AppendedContentRating {
	descriptors: unknown[];
	iso_3166_1: string;
	rating: string;
}

type AppendedProvider = Omit<Provider, 'display_priority'>;

export interface AppendedProviders {
	'watch/providers': {
		results: Record<
			string,
			{
				link: string;
				flatrate: AppendedProvider[];
				buy: AppendedProvider[];
				rent: AppendedProvider[];
			}
		>;
	};
}
