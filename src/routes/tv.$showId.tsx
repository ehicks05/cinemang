import { ErrorComponent, createFileRoute } from '@tanstack/react-router';
import { MediaDetail } from '~/app/MediaDetail';
import { fetchTrailer } from '~/core-components/Trailer/useFetchVideos';
import { getShowById } from '~/hooks/useFetchShows';

export const Route = createFileRoute('/tv/$showId')({
	loader: async ({ params }) => {
		const show = await getShowById(Number(params.showId));
		const trailer = await fetchTrailer({ showId: show.id });
		return { show, trailer };
	},
	component: RouteComponent,
	errorComponent: ErrorComponent,
	ssr: false,
});

function RouteComponent() {
	const { show, trailer } = Route.useLoaderData();

	return <MediaDetail media={show} trailer={trailer} />;
}
