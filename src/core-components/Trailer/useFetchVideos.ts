import { useQuery } from '@tanstack/react-query';
import type { Video } from '~/types/types';
import { tmdb } from '~/utils/tmdb';

const nameIncludesOfficial = (t: Video) => t.name.includes('Official');

type Props =
	| { movieId: number }
	| { showId: number }
	| { showId: number; season: number };

export const fetchTrailer = async (input: Props) => {
	const url =
		'movieId' in input
			? `/movie/${input.movieId}`
			: 'season' in input
				? `/tv/${input.showId}/season/${input.season}`
				: `/tv/${input.showId}`;

	const result = await tmdb.get<{ videos: { results: Video[] } }>(url, {
		params: { append_to_response: 'videos' },
	});

	const trailers =
		result.data.videos.results
			.filter((v) => v.official && v.type === 'Trailer')
			// newest
			.sort((v1, v2) => v2.published_at.localeCompare(v1.published_at)) || [];

	return trailers.filter(nameIncludesOfficial)?.[0] || trailers?.[0] || undefined;
};

export const useFetchTrailers = (input: Props) =>
	useQuery<Video>({
		queryKey: ['films', input, 'trailers'],
		queryFn: async () => fetchTrailer(input),
	});
