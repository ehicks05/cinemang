import { z } from 'zod';
import { PersonImagesSchema } from './images.js';

export const GenderEnum = z.nativeEnum({
	UNSPECIFIED: 0,
	FEMAIL: 1,
	MALE: 2,
	NON_BINARY: 3,
} as const);
export type GenderEnum = z.infer<typeof GenderEnum>;

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

export const CreatorSchema = PersonSchema.pick({
	id: true,
	name: true,
	gender: true,
	profile_path: true,
});
export type Creator = z.infer<typeof CreatorSchema>;

export const PersonResponseSchema = PersonSchema.merge(PersonImagesSchema);
export type PersonResponse = z.infer<typeof PersonResponseSchema>;
