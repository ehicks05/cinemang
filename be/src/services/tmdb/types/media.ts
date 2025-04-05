import { z } from 'zod';
import { MovieResponseSchema } from './movie.js';
import { ShowResponseSchema } from './show.js';

export const MediaResponseSchema = z.union([
	MovieResponseSchema,
	ShowResponseSchema,
]);
export type MediaResponse = z.infer<typeof MediaResponseSchema>;
