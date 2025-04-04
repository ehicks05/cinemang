import { z } from 'zod';

export const CompanySchema = z.object({
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

export const ProductionCompanySchema = CompanySchema.pick({
	id: true,
	logo_path: true,
	name: true,
	origin_country: true,
});
export type ProductionCompany = z.infer<typeof ProductionCompanySchema>;

export const NetworkSchema = CompanySchema.pick({
	headquarters: true,
	homepage: true,
	id: true,
	logo_path: true,
	name: true,
	origin_country: true,
});
export type Network = z.infer<typeof NetworkSchema>;
