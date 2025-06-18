import { createFileRoute, ErrorComponent } from '@tanstack/react-router';
import { MediaDetail } from '~/app/MediaDetail';
import { fetchPerson } from '~/server/fetchPerson';
import { usePalette } from '~/utils/palettes/usePalettes';

export const Route = createFileRoute('/people/$personId')({
	loader: async ({ params }) =>
		fetchPerson({ data: { id: Number(params.personId) } }),
	staleTime: 1000 * 60 * 60,
	component: RouteComponent,
	errorComponent: ErrorComponent,
});

function RouteComponent() {
	const person = Route.useLoaderData();

	if (!person) throw Error('Missing Person');

	const { palette } = usePalette({ path: person.profilePath });
	if (!palette) return null;

	return <MediaDetail media={person} palette={palette} />;
}
