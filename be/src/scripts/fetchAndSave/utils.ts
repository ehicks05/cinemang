import type { AppendedProviders, Credits, Show } from '@ehicks05/tmdb-api';

export const filterCredits = (credits: Credits) => ({
	cast: credits.cast.filter((credit) => credit.profile_path !== null),
	crew: credits.crew.filter((credit) => credit.profile_path !== null),
});

export const trimCredits = (credits: Credits) => ({
	cast: credits.cast.map((credit) => {
		const { id, credit_id, name, character, order, ..._rest } = credit;
		return { id, character, order, credit_id, name };
	}),
	crew: credits.crew.map((credit) => {
		const { id, credit_id, name, job, department, ..._rest } = credit;
		return { id, job, department, credit_id, name };
	}),
});

// Retain US flatrate providers
export const trimWatchProviders = (watchProviders: AppendedProviders) => ({
	results: {
		US: {
			flatrate:
				watchProviders.results.US?.flatrate?.map((provider) => ({
					provider_id: provider.provider_id,
				})) || [],
		},
	},
});

export const trimSeasons = (seasons: Show['seasons']) =>
	seasons.filter((season) => season.season_number !== 0);
