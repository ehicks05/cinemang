import { Link } from '@tanstack/react-router';
import { TmdbImage } from '~/core-components';
import type { Film, Show } from '~/types/types';
import type { PaletteWithGradient } from '~/utils/palettes/palette';
import { MediaProviders, MediaStats, SubHeading, TopCrew } from './';

interface Props {
	media: Film | Show;
	palette: PaletteWithGradient;
}

export const MediaCard = ({ media, palette }: Props) => {
	const { title, linkTo, linkParams } =
		'title' in media
			? {
					title: media.title,
					linkTo: '/films/$filmId',
					linkParams: { filmId: String(media.id) },
				}
			: {
					title: media.name,
					linkTo: '/tv/$showId',
					linkParams: { showId: String(media.id) },
				};

	const fontSize =
		title.length > 36
			? 'font-semibold'
			: title.length > 24
				? 'text-base'
				: 'text-lg';

	return (
		<Link to={linkTo} params={linkParams}>
			<div
				className="flex h-full flex-col justify-between gap-4 p-4 sm:rounded-lg transition-all duration-1000"
				style={palette.bgStyles}
			>
				<div className="flex justify-between gap-0.5">
					<div>
						<span className={`${fontSize} font-bold`}>{title}</span>
						<span className="flex gap-1 text-xs text-neutral-300">
							<SubHeading media={media} />
						</span>
					</div>
					{media.providers && <MediaProviders ids={media.providers} />}
				</div>
				<div className="flex gap-4">
					<div className="shrink-0">
						<TmdbImage className="rounded-sm" path={media.poster_path} />
					</div>
					<div className="flex flex-col gap-1">
						<TopCrew media={media} />
						<div>
							{media.cast.split('|').map((name) => (
								<div key={name}>{name}</div>
							))}
						</div>
						<div className="line-clamp-5 text-xs">{media.overview}</div>
						<div className="grow" />
						<MediaStats
							bgColor={palette.darkVibrant}
							object={media}
							classname="w-full"
						/>
					</div>
				</div>
			</div>
		</Link>
	);
};
