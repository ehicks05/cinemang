import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { MediaList } from '~/app/MediaList';
import { queryFilms } from '~/hooks/useFetchFilms';
import { findFilms } from '~/server/findFilms';
import { DEFAULT_MOVIE_SEARCH_FORM } from '~/utils/searchParams/constants';
import {
	type MovieSearchForm,
	MovieSearchFormSchema,
} from '~/utils/searchParams/types';

export const Route = createFileRoute('/films/index copy')({
	search: { middlewares: [stripSearchParams(DEFAULT_MOVIE_SEARCH_FORM)] },
	validateSearch: zodValidator(MovieSearchFormSchema),
	loaderDeps: ({ search }: { search: MovieSearchForm }) => ({ search }),
	loader: async ({ deps: { search } }) => findFilms({ data: search }),
	component: RouteComponent,
});

function RouteComponent() {
	const { films, count, search } = Route.useLoaderData();

	return <pre>{JSON.stringify({ search, count, films }, null, 2)}</pre>;
}
