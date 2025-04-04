import type {
	AppendedContentRating,
	AppendedImage,
	AppendedImages,
	AppendedProviders,
	AppendedRelease,
	CastCredit,
	CrewCredit,
} from './appends.js';
import type {
	Genre,
	Movie,
	Person,
	Provider,
	RecentChange,
	Season,
	Show,
} from './base.js';

/**
 * These types account for the way some api responses are packaged
 */

export interface GenreResponse {
	genres: Genre[];
}

export interface MovieResponse extends Movie, AppendedImages, AppendedProviders {
	credits: { cast: CastCredit[]; crew: CrewCredit[] };
	releases: { countries: AppendedRelease[] };
}

export interface ShowResponse extends Show, AppendedImages, AppendedProviders {
	credits: { cast: CastCredit[]; crew: CrewCredit[] };
	content_ratings: { results: AppendedContentRating[] };
}

export type MediaResponse = MovieResponse | ShowResponse;

export interface PersonResponse extends Person {
	images: { profiles: AppendedImage[] };
}

export interface RecentChangesResponse {
	results: RecentChange[];
	page: number;
	total_pages: number;
	total_results: number;
}

export interface ProviderResponse {
	results: Provider[];
}

export interface SeasonResponse extends Season {
	credits: { cast: CastCredit[]; crew: CrewCredit[] };
}
