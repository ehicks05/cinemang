import { addMinutes, format, intervalToDuration, parseISO } from 'date-fns';
import { Clapperboard, Lightbulb } from 'lucide-react';
import { useDocumentTitle } from 'usehooks-ts';
import { Credits, OriginalImageLink, Trailer } from '~/core-components';
import { TmdbImage } from '~/core-components/TmdbImage';
import type { Film, Show, Video } from '~/types/types';
import { usePalette } from '~/utils/palettes/usePalettes';
import { MediaProviders } from './MediaProviders';
import { MediaStats } from './MediaStats';
import { Seasons } from './Seasons';

interface Props {
	media: Film | Show;
	trailer: Video;
}

export const SubHeading = ({ media }: { media: Film | Show }) => {
	if ('released_at' in media) {
		const year = format(parseISO(media.released_at), 'yyyy');
		const runtime = intervalToDuration({
			end: addMinutes(new Date(), Number(media.runtime)),
			start: new Date(),
		});

		return (
			<>
				<span className="font-semibold" title={media.released_at}>
					{year}
				</span>
				{' • '}
				<span className="whitespace-nowrap">{`${runtime.hours || 0}h ${runtime.minutes}m`}</span>
			</>
		);
	}

	const firstYear = format(parseISO(media.first_air_date), 'yyyy');
	const lastYear = format(parseISO(media.last_air_date), 'yyyy');
	const years = firstYear === lastYear ? firstYear : `${firstYear}-${lastYear}`;

	return (
		<span>
			{years} ({media.status})
		</span>
	);
};

export const TopCrew = ({ media }: { media: Film | Show }) => {
	if ('director' in media) {
		return (
			<div className="flex items-center gap-1" title="Director">
				<Clapperboard size={16} className="text-neutral-400" /> {media.director}
			</div>
		);
	}
	if (media.created_by) {
		return (
			<div className="flex items-center gap-1" title="Created by">
				<Lightbulb size={16} className="text-neutral-400 shrink-0" />{' '}
				{media.created_by}
			</div>
		);
	}
};

export const MediaDetail = ({ media, trailer }: Props) => {
	const title = 'title' in media ? media.title : media.name;
	useDocumentTitle(title);
	const { isLoading, palette } = usePalette({ path: media.poster_path });
	if (isLoading || !palette) return '';

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
							<TopCrew media={media} />
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
