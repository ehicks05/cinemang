import { z } from 'zod';
import { CastCreditSchema, CrewCreditSchema } from './appends.js';
import {
	GenderEnum,
	MediaStatusEnum,
	MovieStatusEnum,
	ShowStatusEnum,
	ShowTypeEnum,
} from './enums.js';

const CompanySchema = z.object({
	description: z.string(),
	headquarters: z.string(),
	homepage: z.string(),
	id: z.number(),
	logo_path: z.string().nullable(),
	name: z.string(),
	origin_country: z.string().nullable(),
	parent_company: z.string().nullable(),
});
export type Company = z.infer<typeof CompanySchema>;

const GenreSchema = z.object({
	id: z.number(),
	name: z.string(),
});
export type Genre = z.infer<typeof GenreSchema>;

const LanguageSchema = z.object({
	iso_639_1: z.string(),
	english_name: z.string(),
	name: z.string(),
});
export type Language = z.infer<typeof LanguageSchema>;

const ProductionCompanySchema = CompanySchema.pick({
	id: true,
	logo_path: true,
	name: true,
	origin_country: true,
});
export type ProductionCompany = z.infer<typeof ProductionCompanySchema>;

const ProductionCountrySchema = z.object({
	iso_639_1: z.string(),
	name: z.string(),
});
export type ProductionCountry = z.infer<typeof ProductionCountrySchema>;

export const PersonSchema = z.object({
	adult: z.boolean(),
	also_known_as: z.array(z.string()),
	biography: z.string(),
	birthday: z.string().nullable(),
	deathday: z.string().nullable(),
	gender: GenderEnum,
	homepage: z.string().nullable(),
	id: z.number(),
	imdb_id: z.string().nullable(),
	known_for_department: z.string(),
	name: z.string(),
	place_of_birth: z.string().nullable(),
	popularity: z.number(),
	profile_path: z.string().nullable(),
});
export type Person = z.infer<typeof PersonSchema>;

const MediaSchema = z.object({
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
	tagline: z.string().nullable(),
	vote_average: z.number(),
	vote_count: z.number(),
});
export type Media = z.infer<typeof MediaSchema>;

const CollectionSchema = z.object({
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

export const RecentChangeSchema = z.object({
	id: z.number(),
	adult: z.boolean(),
});
export type RecentChange = z.infer<typeof RecentChangeSchema>;

export const NetworkSchema = z.object({
	headquarters: z.string(),
	homepage: z.string(),
	id: z.number(),
	logo_path: z.string().nullable(),
	name: z.string(),
	origin_country: z.string(),
});
export type Network = z.infer<typeof NetworkSchema>;

export const EpisodeSchema = z.object({
	air_date: z.string(),
	crew: z.array(CrewCreditSchema),
	episode_number: z.number(),
	guest_stars: z.array(CastCreditSchema),
	id: z.number(),
	name: z.string(),
	overview: z.string(),
	production_code: z.string().nullable(),
	runtime: z.number().nullable(),
	season_number: z.number(),
	still_path: z.string().nullable(),
	vote_average: z.number(),
	vote_count: z.number(),
});
export type Episode = z.infer<typeof EpisodeSchema>;

export const SeasonSchema = z.object({
	_id: z.string(),
	air_date: z.string(),
	episodes: z.array(EpisodeSchema),
	name: z.string(),
	overview: z.string(),
	id: z.number(),
	poster_path: z.string().nullable(),
	season_number: z.number(),
	vote_average: z.number(),
});
export type Season = z.infer<typeof SeasonSchema>;

export const SeasonSummarySchema = SeasonSchema.omit({
	episodes: true,
	_id: true,
}).extend({ episode_count: z.number() });
export type SeasonSummary = z.infer<typeof SeasonSummarySchema>;

export const ShowSchema = MediaSchema.extend({
	created_by: z.array(
		PersonSchema.pick({
			id: true,
			name: true,
			gender: true,
			profile_path: true,
		}),
	),
	episode_run_time: z.array(z.number()),
	first_air_date: z.string(),
	in_production: z.boolean(),
	languages: z.array(LanguageSchema),
	last_air_date: z.string(),
	last_episode_to_air: EpisodeSchema.partial(),
	name: z.string(),
	next_episode_to_air: EpisodeSchema.partial(),
	networks: z.array(NetworkSchema),
	number_of_episodes: z.number(),
	number_of_seasons: z.number(),
	origin_country: z.array(z.string()),
	original_name: z.string(),
	seasons: z.array(SeasonSummarySchema),
	spoken_languages: z.array(LanguageSchema),
	status: ShowStatusEnum,
	type: ShowTypeEnum,
});
export type Show = z.infer<typeof ShowSchema>;

export const ProviderSchema = z.object({
	display_priorities: z.record(z.string(), z.number()),
	display_priority: z.number(),
	logo_path: z.string(),
	provider_name: z.string(),
	provider_id: z.number(),
});
export type Provider = z.infer<typeof ProviderSchema>;
