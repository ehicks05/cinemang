import { createFileRoute, ErrorComponent } from '@tanstack/react-router';
import { MediaDetail } from '~/app/MediaDetail';
import { fetchTrailer } from '~/core-components/Trailer/useFetchVideos';
import { fetchShow } from '~/server/fetchShow';
import { usePalette } from '~/utils/palettes/usePalettes';

export const Route = createFileRoute('/tv/$showId')({
	loader: async ({ params }) => {
		const show = await fetchShow({ data: { id: Number(params.showId) } });
		const trailer = await fetchTrailer({ showId: show?.id || 0 });
		return { show, trailer };
	},
	staleTime: 1000 * 60 * 60,
	component: RouteComponent,
	errorComponent: ErrorComponent,
});

function RouteComponent() {
	const { show, trailer } = Route.useLoaderData();

	if (!show) throw Error('Missing Show');

	const { palette } = usePalette({ path: show.posterPath });
	if (!palette) return null;

	return <MediaDetail media={show} trailer={trailer} palette={palette} />;
}
