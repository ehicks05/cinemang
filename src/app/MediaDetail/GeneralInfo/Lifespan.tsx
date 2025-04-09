import { intervalToDuration } from 'date-fns';
import type { Person } from '~/types/types';
import type { PaletteWithGradient } from '~/utils/palettes/palette';

interface Props {
	palette: PaletteWithGradient;
	person: Person;
}

export const Lifespan = ({ person, palette }: Props) => {
	const { birthday, deathday } = person;

	const age = intervalToDuration({
		end: deathday ? deathday : new Date(),
		start: birthday ? birthday : new Date(),
	});

	if (!birthday && !deathday) return null;

	return (
		<div className="border-l-4 pl-2" style={{ borderColor: palette.darkVibrant }}>
			{birthday && (
				<div>
					<div className="font-semibold">Born</div>
					<div>
						{birthday.toLocaleDateString()} {!deathday && `(${age.years})`}
					</div>
					<div>{person.placeOfBirth && person.placeOfBirth}</div>
				</div>
			)}
			{deathday && (
				<div>
					<div className="font-semibold">Died</div>
					<div>
						{deathday.toLocaleDateString()} ({age.years})
					</div>
				</div>
			)}
		</div>
	);
};
