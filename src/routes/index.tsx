import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { MediaList } from '~/app/MediaList';
import { findFilms } from '~/server/findFilms';
import { DEFAULT_MOVIE_SEARCH_FORM } from '~/utils/searchParams/constants';
import {
	type MovieSearchForm,
	MovieSearchFormSchema,
} from '~/utils/searchParams/types';

export const Route = createFileRoute('/')({
	search: { middlewares: [stripSearchParams(DEFAULT_MOVIE_SEARCH_FORM)] },
	validateSearch: zodValidator(MovieSearchFormSchema),
	loaderDeps: ({ search }: { search: MovieSearchForm }) => ({ search }),
	loader: async ({ deps: { search } }) => findFilms({ data: search }),
	staleTime: 1000 * 60 * 60,
	component: RouteComponent,
});

function RouteComponent() {
	const { films, hasMore } = Route.useLoaderData();

	return <MediaList media={films || []} hasMore={hasMore} />;
}
