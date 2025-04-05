import { z } from 'zod';

export const ProviderSchema = z.object({
	display_priorities: z.record(z.string(), z.number()),
	display_priority: z.number(),
	logo_path: z.string(),
	provider_name: z.string(),
	provider_id: z.number(),
});
export type Provider = z.infer<typeof ProviderSchema>;

export const AppendedProviderSchema = ProviderSchema.omit({
	display_priorities: true,
});
export type AppendedProvider = z.infer<typeof AppendedProviderSchema>;

export const AppendedProvidersSchema = z.object({
	'watch/providers': z.object({
		results: z.record(
			z.string(),
			z.object({
				link: z.string().optional(),
				flatrate: z.array(AppendedProviderSchema).optional(),
				buy: z.array(AppendedProviderSchema).optional(),
				rent: z.array(AppendedProviderSchema).optional(),
			}),
		),
	}),
});
export type AppendedProviders = z.infer<typeof AppendedProvidersSchema>;

export const ProviderResponseSchema = z.object({
	results: z.array(ProviderSchema),
});
export type ProviderResponse = z.infer<typeof ProviderResponseSchema>;
