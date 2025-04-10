import { useQuery } from '@tanstack/react-query';
import { fetchSyncLog } from '~/server/fetchSyncLog';

export const useFetchSyncLog = () =>
	useQuery({
		queryKey: ['syncLog'],
		queryFn: async () => fetchSyncLog(),
		staleTime: 1000 * 60 * 60,
	});
