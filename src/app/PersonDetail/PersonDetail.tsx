import { useDocumentTitle } from 'usehooks-ts';
import { OriginalImageLink, TmdbImage } from '~/core-components';
import type { Person } from '~/types/types';
import type { PaletteWithGradient } from '~/utils/palettes/palette';
import { MediaStats } from '../components';
import { Lifespan } from './Lifespan';
import { PersonCredits } from './PersonCredits';

interface Props {
	person: Person;
	palette: PaletteWithGradient;
}

export const PersonDetail = ({ person, palette }: Props) => {
	useDocumentTitle(person.name);

	return (
		<div
			className="m-auto flex max-w-(--breakpoint-lg) flex-col gap-4 p-4 sm:rounded-lg"
			style={palette.bgStyles}
		>
			<div className="flex flex-col gap-4 sm:flex-row">
				<div className="flex flex-col gap-4 sm:w-2/5">
					<div className="relative">
						<TmdbImage
							className="w-full rounded-lg sm:w-80 md:w-96"
							path={person.profile_path}
							width={500}
						/>
						<OriginalImageLink path={person.profile_path} />
					</div>
					<MediaStats bgColor={palette.darkMuted} object={person} />
				</div>

				<div className="flex flex-col gap-4 sm:w-3/5">
					<div className="flex flex-col gap-1">
						<div className="text-2xl font-semibold">{person.name}</div>
						<div className="text-sm font-semibold">
							{person.known_for_department} {' • '} {person.credits.length} Credits
						</div>
						<div className="flex flex-col gap-2 text-justify">
							{person.biography
								.split('\n')
								.filter(Boolean)
								.map((b) => (
									<div key={b}>{b}</div>
								))}
						</div>
					</div>
					<Lifespan palette={palette} person={person} />
				</div>
			</div>

			<PersonCredits person={person} palette={palette} />
		</div>
	);
};
