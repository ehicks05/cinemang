import { ErrorComponent, createFileRoute } from '@tanstack/react-router';
import { MediaDetail } from '~/app/MediaDetail';
import { fetchTrailer } from '~/core-components/Trailer/useFetchVideos';
import { getShowById } from '~/hooks/useFetchShows';
import { usePalette } from '~/utils/palettes/usePalettes';

export const Route = createFileRoute('/tv/$showId')({
	loader: async ({ params }) => {
		const show = await getShowById(Number(params.showId));
		const trailer = await fetchTrailer({ showId: show.id });
		return { show, trailer };
	},
	component: RouteComponent,
	errorComponent: ErrorComponent,
});

function RouteComponent() {
	const { show, trailer } = Route.useLoaderData();

	const { palette } = usePalette({ path: show.poster_path });
	if (!palette) return null;

	return <MediaDetail media={show} trailer={trailer} palette={palette} />;
}
