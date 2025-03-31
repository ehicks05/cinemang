import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { MediaList } from '~/app/MediaList';
import { queryFilms } from '~/hooks/useFetchFilms';
import { DEFAULT_MOVIE_SEARCH_FORM } from '~/utils/searchParams/constants';
import {
	type MovieSearchForm,
	MovieSearchFormSchema,
} from '~/utils/searchParams/types';

export const Route = createFileRoute('/films/')({
	search: { middlewares: [stripSearchParams(DEFAULT_MOVIE_SEARCH_FORM)] },
	validateSearch: zodValidator(MovieSearchFormSchema),
	loaderDeps: ({ search }: { search: MovieSearchForm }) => ({ search }),
	loader: async ({ deps: { search } }) => queryFilms(search),
	component: RouteComponent,
});

function RouteComponent() {
	const { films, count } = Route.useLoaderData();

	return <MediaList media={films || []} count={count || 0} />;
}
