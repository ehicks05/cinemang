import { ErrorComponent, createFileRoute } from '@tanstack/react-router';
import { PersonDetail } from '~/app/PersonDetail';
import { getPersonById } from '~/hooks/useFetchPersons';
import { usePalette } from '~/utils/palettes/usePalettes';

export const Route = createFileRoute('/people/$personId')({
	loader: async ({ params }) => getPersonById(Number(params.personId)),
	component: RouteComponent,
	errorComponent: ErrorComponent,
});

function RouteComponent() {
	const person = Route.useLoaderData();

	const { palette } = usePalette({ path: person.profile_path });
	if (!palette) return null;

	return (
		<div>
			<PersonDetail person={person} palette={palette} />
		</div>
	);
}
