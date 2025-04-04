import { z } from 'zod';

export const GenreSchema = z.object({
	id: z.number(),
	name: z.string(),
});
export type Genre = z.infer<typeof GenreSchema>;

export const GenreResponseSchema = z.object({
	genres: z.array(GenreSchema),
});
export type GenreResponse = z.infer<typeof GenreResponseSchema>;
