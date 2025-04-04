import { z } from 'zod';

export const RecentChangeSchema = z.object({
	id: z.number(),
	adult: z.boolean(),
});
export type RecentChange = z.infer<typeof RecentChangeSchema>;

export const RecentChangesResponseSchema = z.object({
	results: z.array(RecentChangeSchema),
	page: z.number(),
	total_pages: z.number(),
	total_results: z.number(),
});
export type RecentChangesResponse = z.infer<typeof RecentChangesResponseSchema>;
