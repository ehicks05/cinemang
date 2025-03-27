import { createFileRoute, stripSearchParams } from '@tanstack/react-router';
import { zodValidator } from '@tanstack/zod-adapter';
import { MediaList } from '~/app/MediaList';
import { queryShows } from '~/hooks/useFetchShows';
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

	return <MediaList media={shows} count={count} />;
}
