import { ErrorComponent, createFileRoute } from '@tanstack/react-router';
import { PersonDetail } from '~/app/PersonDetail';
import { getPersonById } from '~/hooks/useFetchPersons';

export const Route = createFileRoute('/people/$personId')({
	loader: async ({ params }) => {
		const person = await getPersonById(Number(params.personId));
		return { person };
	},
	component: RouteComponent,
	errorComponent: ErrorComponent,
	ssr: false,
});

function RouteComponent() {
	const { person } = Route.useLoaderData();

	return (
		<div>
			<PersonDetail person={person} />
		</div>
	);
}
