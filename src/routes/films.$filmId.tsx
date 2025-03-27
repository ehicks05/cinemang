import { ErrorComponent, createFileRoute } from '@tanstack/react-router';
import { MediaDetail } from '~/app/MediaDetail';
import { fetchTrailer } from '~/core-components/Trailer/useFetchVideos';
import { getFilmById } from '~/hooks/useFetchFilms';
import { usePalette } from '~/utils/palettes/usePalettes';

export const Route = createFileRoute('/films/$filmId')({
	loader: async ({ params }) => {
		const film = await getFilmById(Number(params.filmId));
		const trailer = await fetchTrailer({ movieId: film.id });
		return { film, trailer };
	},
	component: RouteComponent,
	errorComponent: ErrorComponent,
});

function RouteComponent() {
	const { film, trailer } = Route.useLoaderData();

	const { palette } = usePalette({ path: film.poster_path });
	if (!palette) return null;

	return <MediaDetail media={film} trailer={trailer} palette={palette} />;
}
