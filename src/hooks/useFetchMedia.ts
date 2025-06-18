import { useQuery } from '@tanstack/react-query';
import { fetchFilm } from '~/server/fetchFilm';
import { fetchShow } from '~/server/fetchShow';

export const useFetchMedia = ({ id, type }: { id: number; type: 'film' | 'tv' }) => {
	const queryKey = [type === 'film' ? 'films' : 'shows', id];
	const fetchMedia = type === 'film' ? fetchFilm : fetchShow;

	return useQuery({
		queryKey,
		queryFn: async () => fetchMedia({ data: { id } }),
	});
};
