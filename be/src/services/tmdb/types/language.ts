import { z } from 'zod';

export const LanguageSchema = z.object({
	iso_639_1: z.string(),
	english_name: z.string(),
	name: z.string(),
});
export type Language = z.infer<typeof LanguageSchema>;

export const LanguageResponseSchema = z.array(LanguageSchema);
export type LanguageResponse = z.infer<typeof LanguageResponseSchema>;
