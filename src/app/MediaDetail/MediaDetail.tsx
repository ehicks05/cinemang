import { SiThemoviedatabase } from 'react-icons/si';
import { OriginalImageLink, TmdbImage, Trailer } from '~/core-components';
import type { Film, Person, Show, Video } from '~/types/types';
import type { PaletteWithGradient } from '~/utils/palettes/palette';
import { MediaProviders, MediaStats, SubHeading } from '../components';
import { GeneralInfo } from './GeneralInfo';
import { MediaCredits } from './MediaCredits';
import { PersonCredits } from './PersonCredits';
import { Seasons } from './Seasons';

const Heading = ({ media }: { media: Film | Show | Person }) => {
	const title = 'title' in media ? media.title : media.name;

	return (
		<div>
			<div className="text-2xl font-semibold sm:text-3xl">{title}</div>
			<div className="text-sm text-neutral-300">
				<SubHeading media={media} />
			</div>
		</div>
	);
};

const Image = ({ media }: { media: Film | Show | Person }) => {
	const imagePath = 'profile_path' in media ? media.profile_path : media.poster_path;

	return (
		<div className="w-full sm:w-2/5 relative">
			<TmdbImage className="w-full rounded-lg" path={imagePath} width={500} />
			<OriginalImageLink path={imagePath} />
		</div>
	);
};

const TmdbLink = ({
	media,
	palette,
}: { media: Film | Show | Person; palette: PaletteWithGradient }) => (
	<a
		href={`https://www.themoviedb.org/${'birthday' in media ? 'person' : 'title' in media ? 'movie' : 'tv'}/${media.id}`}
		className="flex items-center justify-center h-8 w-8 rounded-full"
		style={{ backgroundColor: palette.darkVibrant }}
		target="_blank"
		rel="noreferrer"
	>
		<SiThemoviedatabase size={22} />
	</a>
);

interface Props {
	media: Film | Show | Person;
	palette: PaletteWithGradient;
	trailer?: Video;
}

export const MediaDetail = ({ media, palette, trailer }: Props) => {
	return (
		<div
			className="m-auto flex max-w-5xl flex-col gap-4 p-4 sm:rounded-lg"
			style={palette.bgStyles}
		>
			<Heading media={media} />
			<div className="flex flex-col gap-4 sm:flex-row">
				<Image media={media} />
				<div className="flex flex-col w-full gap-4 sm:w-3/5">
					<div className="flex flex-col grow gap-2">
						{trailer && <Trailer trailer={trailer} />}

						<div className="flex gap-1 items-center">
							{'providers' in media && (
								<>
									<MediaStats bgColor={palette.darkVibrant} object={media} />
									<MediaProviders selectedIds={media.providers} />
								</>
							)}
							<TmdbLink media={media} palette={palette} />
						</div>
						<GeneralInfo media={media} palette={palette} />
					</div>
				</div>
			</div>

			{'seasons' in media && <Seasons seasons={media.seasons} />}

			{'birthday' in media ? (
				<PersonCredits person={media} palette={palette} />
			) : (
				<MediaCredits credits={media.credits} palette={palette} />
			)}
		</div>
	);
};
