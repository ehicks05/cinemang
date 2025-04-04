import type { CastCredit, CrewCredit } from '~/services/tmdb/types/credits.js';
import type { MediaResponse } from '~/services/tmdb/types/media.js';
import type { AppendedProviders } from '~/services/tmdb/types/provider.js';

interface Credits {
	cast: CastCredit[];
	crew: CrewCredit[];
}

export const filterCredits = (credits: Credits) => ({
	cast: credits.cast.filter((credit) => credit.profile_path !== null),
	crew: credits.crew.filter((credit) => credit.profile_path !== null),
});

export const trimCredits = (credits: Credits) => ({
	cast: credits.cast.map((credit) => {
		const { id, character, order, credit_id, name, ...rest } = credit;
		return { id, character, order, credit_id, name };
	}),
	crew: credits.crew.map((credit) => {
		const { id, job, department, credit_id, name, ...rest } = credit;
		return { id, job, department, credit_id, name };
	}),
});

// Retain US flatrate providers
export const trimWatchProviders = (watchProviders: AppendedProviders) => ({
	results: {
		US: {
			flatrate:
				watchProviders['watch/providers'].results.US?.flatrate?.map((provider) => ({
					provider_id: provider.provider_id,
				})) || [],
		},
	},
});

export const trimSeasons = (media: MediaResponse) => ({
	seasons:
		'seasons' in media
			? media.seasons.filter((season) => season.season_number !== 0)
			: undefined,
});
