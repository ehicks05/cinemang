import { ErrorComponent, createFileRoute } from '@tanstack/react-router';
import { MediaDetail } from '~/app/MediaDetail';
import { fetchTrailer } from '~/core-components/Trailer/useFetchVideos';
import { fetchFilm } from '~/server/drizzle/fetchFilm';
import { usePalette } from '~/utils/palettes/usePalettes';

export const Route = createFileRoute('/films/$filmId')({
	loader: async ({ params }) => {
		const film = await fetchFilm({ data: { id: Number(params.filmId) } });
		const trailer = await fetchTrailer({ movieId: film?.id || 0 });
		return { film, trailer };
	},
	staleTime: 1000 * 60 * 60,
	component: RouteComponent,
	errorComponent: ErrorComponent,
});

function RouteComponent() {
	const { film, trailer } = Route.useLoaderData();

	if (!film) throw Error('Missing Film');

	const { palette } = usePalette({ path: film.posterPath });
	if (!palette) return null;

	return <MediaDetail media={film} trailer={trailer} palette={palette} />;
}
