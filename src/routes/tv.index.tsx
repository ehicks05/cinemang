import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { MediaList } from '~/app/MediaList';
import { queryShows } from '~/hooks/useFetchShows';
import { usePalettes } from '~/utils/palettes/usePalettes';
import { DEFAULT_TV_SEARCH_FORM } from '~/utils/searchParams/constants';
import { type TvSearchForm, TvSearchFormSchema } from '~/utils/searchParams/types';

export const Route = createFileRoute('/tv/')({
	search: { middlewares: [stripSearchParams(DEFAULT_TV_SEARCH_FORM)] },
	validateSearch: zodValidator(TvSearchFormSchema),
	loaderDeps: ({ search }: { search: TvSearchForm }) => ({ search }),
	loader: async ({ deps: { search } }) => queryShows(search),
	component: RouteComponent,
});

function RouteComponent() {
	const { shows, count } = Route.useLoaderData();

	const { palettes } = usePalettes({ paths: shows.map((show) => show.poster_path) });
	if (!palettes) return null;

	return <MediaList media={shows} count={count} palettes={palettes} />;
}
