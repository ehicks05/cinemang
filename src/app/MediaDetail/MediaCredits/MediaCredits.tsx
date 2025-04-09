import { groupBy } from 'lodash-es';

import type { MediaCredit } from '~/types/types';
import type { PaletteWithGradient } from '~/utils/palettes/palette';
import { PersonCard } from './PersonCard';

interface Props {
	credits: MediaCredit[];
	palette: PaletteWithGradient;
}

export const MediaCredits = ({ credits, palette }: Props) => {
	const cast = credits.filter((c) => c.character);
	const crew = credits.filter((c) => c.job);
	const groupedCast = groupBy(cast, (c) => c.personId);
	const groupedCrew = groupBy(crew, (c) => c.personId);

	return (
		<>
			<h1 className="text-xl font-bold">Cast</h1>
			<div className="grid grid-cols-2 justify-center gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
				{Object.values(groupedCast)
					.sort((c1, c2) => (c1[0].order || 0) - (c2[0].order || 0))
					.map((c) => (
						<PersonCard
							characters={c.map((c) => c.character || '')}
							key={c[0].creditId}
							name={c[0].person.name}
							palette={palette}
							personId={c[0].person.id}
							profilePath={c[0].person.profilePath}
						/>
					))}
			</div>
			<h1 className="text-xl font-bold">Crew</h1>
			<div className="grid grid-cols-2 justify-center gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
				{Object.values(groupedCrew)
					.sort((c1, c2) => c1[0].person.id - c2[0].person.id)
					.map((c) => (
						<PersonCard
							jobs={c.map((c) => c.job || '')}
							key={c[0].creditId}
							name={c[0].person.name}
							palette={palette}
							personId={c[0].person.id}
							profilePath={c[0].person.profilePath}
						/>
					))}
			</div>
		</>
	);
};
