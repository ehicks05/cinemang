import { fallback } from '@tanstack/zod-adapter';
import { z } from 'zod';

const SortColumnEnum = z.enum([
	'voteCount',
	'voteAverage',
	'releasedAt',
	'lastAirDate',
]);
export type SortColumn = z.infer<typeof SortColumnEnum>;

const SearchFormSchema = z.object({
	ascending: fallback(z.boolean(), false).default(false),
	creditName: fallback(z.string(), '').default(''),
	genre: fallback(z.number(), 0).default(0),
	language: fallback(z.string(), '').default(''),
	maxRating: fallback(z.number(), 0).default(10),
	minVotes: fallback(z.number(), 0).default(200),
	maxVotes: fallback(z.number(), 0).default(100_000),
	minRating: fallback(z.number(), 0).default(6),
	page: fallback(z.number(), 0).default(0),
	providers: fallback(z.number().array(), []).default([]),
});

export const MovieSearchFormSchema = SearchFormSchema.extend({
	maxReleasedAt: fallback(z.string(), '').default(''),
	minReleasedAt: fallback(z.string(), '').default(''),
	title: fallback(z.string(), '').default(''),
	sortColumn: fallback(SortColumnEnum, 'releasedAt').default('releasedAt'),
});

export type MovieSearchForm = z.infer<typeof MovieSearchFormSchema>;

export const TvSearchFormSchema = SearchFormSchema.extend({
	maxLastAirDate: fallback(z.string(), '').default(''),
	minLastAirDate: fallback(z.string(), '').default(''),
	name: fallback(z.string(), '').default(''),
	sortColumn: fallback(SortColumnEnum, 'lastAirDate').default('lastAirDate'),
});

export type TvSearchForm = z.infer<typeof TvSearchFormSchema>;
