import { z } from 'zod';

const SortColumnEnum = z.enum([
	'voteCount',
	'voteAverage',
	'releasedAt',
	'lastAirDate',
]);
export type SortColumn = z.infer<typeof SortColumnEnum>;

const SearchFormSchema = z.object({
	ascending: z.boolean().default(false),
	creditName: z.string().default(''),
	genre: z.number().default(0),
	language: z.string().default(''),
	maxRating: z.number().default(10),
	minVotes: z.number().default(200),
	maxVotes: z.number().default(100_000),
	minRating: z.number().default(6),
	page: z.number().default(0),
	providers: z.number().array().default([]),
});

export const MovieSearchFormSchema = SearchFormSchema.extend({
	maxReleasedAt: z.string().default(''),
	minReleasedAt: z.string().default(''),
	title: z.string().default(''),
	sortColumn: SortColumnEnum.default('releasedAt'),
});

export type MovieSearchForm = z.infer<typeof MovieSearchFormSchema>;

export const TvSearchFormSchema = SearchFormSchema.extend({
	maxLastAirDate: z.string().default(''),
	minLastAirDate: z.string().default(''),
	name: z.string().default(''),
	sortColumn: SortColumnEnum.default('lastAirDate'),
});

export type TvSearchForm = z.infer<typeof TvSearchFormSchema>;
