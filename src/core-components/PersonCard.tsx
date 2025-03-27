import { Link } from '@tanstack/react-router';
import type { Palette } from '~/utils/palettes/palette';
import { TmdbImage } from './TmdbImage';

interface Props {
	characters?: string[];
	jobs?: string[];
	name: string;
	palette: Palette;
	personId: number;
	profilePath?: string;
}

export const PersonCard = ({
	characters,
	jobs,
	name,
	palette,
	personId,
	profilePath,
}: Props) => {
	return (
		<Link
			className="flex w-full flex-col rounded-lg p-0.5"
			style={{ backgroundColor: palette.darkMuted }}
			to={'/people/$personId'}
			params={{ personId: String(personId) }}
		>
			<TmdbImage
				alt="cast"
				className="w-full rounded-t-lg"
				path={profilePath || ''}
			/>

			<div className="grow p-1.5">
				<div>{name}</div>
				{characters && <div className="text-sm">as {characters.join(', ')}</div>}
				{jobs && <div className="text-sm">{jobs.join(', ')}</div>}
			</div>
		</Link>
	);
};
