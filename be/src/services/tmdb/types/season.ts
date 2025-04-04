import { z } from 'zod';
import {
	CastCreditSchema,
	CreditsMergeSchema,
	CrewCreditSchema,
} from './credits.js';

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

export const SeasonResponseSchema = SeasonSchema.merge(CreditsMergeSchema);
export type SeasonResponse = z.infer<typeof SeasonResponseSchema>;
