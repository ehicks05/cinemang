import type { Film, Person, Show } from '~/types/types';
import type { PaletteWithGradient } from '~/utils/palettes/palette';
import { TopCrew } from '../../components/TopCrew';
import { Lifespan } from './Lifespan';

interface Props {
	media: Film | Show | Person;
	palette: PaletteWithGradient;
}

export const GeneralInfo = ({ media, palette }: Props) => {
	return (
		<div className="flex flex-col gap-2 rounded-lg bg-neutral-900 p-4">
			{('director' in media || 'createdBy' in media) && (
				<TopCrew media={media} showAllCreators />
			)}
			{/* STARRING */}
			{'cast' in media && <div>Starring: {media.cast.replaceAll('|', ', ')}</div>}
			{/* OVERVIEW */}
			{'overview' in media && (
				<div className="sm:max-h-24 md:max-h-32 lg:max-h-48 overflow-x-auto text-justify text-sm">
					{media.overview}
				</div>
			)}
			{/* BIO */}
			{'biography' in media && (
				<div className="flex flex-col gap-2 pr-1 sm:max-h-72 md:max-h-80 lg:max-h-96 overflow-x-auto text-justify text-sm">
					{media.biography
						.split('\n')
						.filter(Boolean)
						.map((b) => (
							<div key={b}>{b}</div>
						))}
					{!media.biography && 'No biography has been added yet.'}
				</div>
			)}
			{'birthday' in media && <Lifespan palette={palette} person={media} />}
		</div>
	);
};
