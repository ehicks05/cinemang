import { useQuery } from '@tanstack/react-query';
import { getTmdbImage } from '~/utils/getTmdbImage';
import { toPalette, toPalettes } from '~/utils/palettes/palette';

export const usePalettes = ({ paths }: { paths: string[] }) => {
	const query = useQuery({
		queryKey: ['palettes', paths],
		queryFn: async () => {
			const urls = paths.map((path) => getTmdbImage({ path }));
			return await toPalettes(urls);
		},
		staleTime: 1000 * 60 * 60 * 24,
	});

	return { palettes: query.data, ...query, data: undefined };
};

export const usePalette = ({ path }: { path?: string }) => {
	const query = useQuery({
		queryKey: ['palette', path],
		queryFn: () => {
			const url = getTmdbImage({ path });
			return toPalette(url);
		},
		staleTime: 1000 * 60 * 60 * 24,
	});

	return { palette: query.data, ...query, data: undefined };
};
