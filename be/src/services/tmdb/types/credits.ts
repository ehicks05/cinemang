import { z } from 'zod';
import { PersonSchema } from './person.js';

const CreditBaseSchema = PersonSchema.pick({
	adult: true,
	gender: true,
	id: true,
	known_for_department: true,
	name: true,
	popularity: true,
	profile_path: true,
}).extend({
	credit_id: z.string(),
	original_name: z.string(),
});

export const CastCreditSchema = CreditBaseSchema.extend({
	cast_id: z.number(),
	character: z.string(),
	order: z.number(),
});
export type CastCredit = z.infer<typeof CastCreditSchema>;

export const CrewCreditSchema = CreditBaseSchema.extend({
	department: z.string(),
	job: z.string(),
});
export type CrewCredit = z.infer<typeof CrewCreditSchema>;

export const CreditSchema = z.union([CastCreditSchema, CrewCreditSchema]);
export type Credit = z.infer<typeof CreditSchema>;

export const CreditsSchema = z.object({
	cast: z.array(CastCreditSchema),
	crew: z.array(CrewCreditSchema),
});
export type Credits = z.infer<typeof CreditsSchema>;

export const CreditsMergeSchema = z.object({
	credits: CreditsSchema,
});
export type CreditsMerge = z.infer<typeof CreditsMergeSchema>;
