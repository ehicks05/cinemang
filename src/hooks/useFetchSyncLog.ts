import { useQuery } from '@tanstack/react-query';
import { fetchSyncLog } from '~/server/drizzle/fetchSyncLog';

export const useFetchSyncLog = () =>
	useQuery({
		queryKey: ['syncLog'],
		queryFn: async () => fetchSyncLog(),
		staleTime: 1000 * 60 * 60,
	});
