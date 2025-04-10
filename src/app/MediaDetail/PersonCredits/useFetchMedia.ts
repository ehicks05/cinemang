import { useQuery } from '@tanstack/react-query';
import { fetchFilm } from '~/server/prisma/fetchFilm';
import { fetchShow } from '~/server/prisma/fetchShow';

export const useFetchFilm = (id: number) =>
	useQuery({
		queryKey: ['films', id],
		queryFn: async () => fetchFilm({ data: { id } }),
	});

export const useFetchShow = (id: number) =>
	useQuery({
		queryKey: ['shows', id],
		queryFn: async () => fetchShow({ data: { id } }),
	});
