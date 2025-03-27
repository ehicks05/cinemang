import { useDocumentTitle } from 'usehooks-ts';
import { OriginalImageLink, TmdbImage, Trailer } from '~/core-components';
import type { Film, Show, Video } from '~/types/types';
import type { PaletteWithGradient } from '~/utils/palettes/palette';
import { MediaProviders, MediaStats, SubHeading, TopCrew } from '../components';
import { Credits } from './Credits';
import { Seasons } from './Seasons';

interface Props {
	media: Film | Show;
	palette: PaletteWithGradient;
	trailer: Video;
}

export const MediaDetail = ({ media, palette, trailer }: Props) => {
	const title = 'title' in media ? media.title : media.name;
	useDocumentTitle(title);

	return (
		<div
			className="m-auto flex max-w-5xl flex-col gap-4 p-4 sm:rounded-lg"
			style={palette.bgStyles}
		>
			<div>
				<div className="text-2xl font-semibold sm:text-3xl">{title}</div>
				<div className="text-sm text-neutral-300">
					<SubHeading media={media} />
				</div>
			</div>
			<div className="flex flex-col gap-4 sm:flex-row">
				<div className="w-full sm:w-2/5">
					<div className="relative w-full">
						<TmdbImage
							className="w-full rounded-lg"
							path={media.poster_path}
							width={500}
						/>

						<OriginalImageLink path={media.poster_path} />
					</div>
					<div className="mt-4 flex flex-col justify-between gap-4">
						<MediaStats bgColor={palette.darkVibrant} object={media} />
					</div>
				</div>
				<div className="flex flex-col w-full gap-4 sm:w-3/5">
					<div className="flex flex-col grow gap-1">
						{trailer && <Trailer trailer={trailer} />}
						{media.providers.length > 0 && (
							<MediaProviders selectedIds={media.providers} />
						)}
						<div className="flex flex-col gap-2 rounded-lg bg-neutral-900 p-4">
							<TopCrew media={media} showAllCreators />
							<div>Starring: {media.cast}</div>
							<div className=" sm:max-h-24 md:max-h-32 lg:max-h-48 overflow-x-auto text-justify text-sm md:text-base">
								{media.overview}
							</div>
						</div>
					</div>
				</div>
			</div>

			{'seasons' in media && <Seasons seasons={media.seasons} />}

			<Credits credits={media.credits} palette={palette} />
		</div>
	);
};
