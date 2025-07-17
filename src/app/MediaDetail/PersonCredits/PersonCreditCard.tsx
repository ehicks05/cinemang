import * as HoverCard from '@radix-ui/react-hover-card';
import { Link } from '@tanstack/react-router';
import { format } from 'date-fns';
import { MediaStats } from '~/app/components';
import type { PersonCredit } from '~/types/types';
import { HoverMedia } from './HoverMedia';

interface Props {
	bgColor: string;
	credit: PersonCredit;
}

const getYears = (credit: PersonCredit) => {
	if ('movie' in credit && credit.movie) {
		return format(credit.movie.releasedAt, 'yyyy');
	}
	if ('show' in credit && credit.show) {
		const firstYear = format(credit.show.firstAirDate, 'yyyy');
		const lastYear = format(credit.show.lastAirDate, 'yyyy');
		return firstYear === lastYear ? firstYear : `${firstYear}-${lastYear}`;
	}
};

export const PersonCreditCard = ({ bgColor, credit }: Props) => {
	const year = getYears(credit);

	const mediaName = credit.movie?.title || credit.show?.name || '';

	const mediaPath = credit.movieId
		? `/films/${credit.movieId}`
		: `/tv/${credit.showId}`;

	return (
		<HoverCard.Root openDelay={100}>
			<div
				className="flex flex-col justify-between gap-2 rounded-sm border p-2"
				style={{ borderColor: bgColor }}
			>
				<div className="flex flex-col gap-2">
					<div className="flex flex-col">
						<HoverCard.Trigger asChild>
							<Link to={mediaPath}>
								<span className="font-bold">{mediaName}</span>
							</Link>
						</HoverCard.Trigger>
						<span className="text-xs">{year}</span>
					</div>
					<div>{credit.character || credit.job}</div>
				</div>
				<div>
					<MediaStats bgColor={bgColor} object={credit.movie || credit.show} />
				</div>
			</div>
			<HoverCard.Portal>
				<HoverCard.Content>
					{credit.movieId && <HoverMedia id={credit.movieId} mediaType="film" />}
					{credit.showId && <HoverMedia id={credit.showId} mediaType="tv" />}
					<HoverCard.Arrow className="text-neutral-700" />
				</HoverCard.Content>
			</HoverCard.Portal>
		</HoverCard.Root>
	);
};
