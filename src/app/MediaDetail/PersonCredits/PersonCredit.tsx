import * as HoverCard from '@radix-ui/react-hover-card';
import { Link } from '@tanstack/react-router';
import { format, parseISO } from 'date-fns';
import { MediaStats } from '~/app/components';
import type { Credit } from '~/types/types';
import { HoverMedia } from './HoverMedia';

interface Props {
	bgColor: string;
	credit: Credit;
}

const getYears = (credit: Credit) => {
	if (credit.movie) {
		return format(parseISO(credit.movie.released_at), 'yyyy');
	}
	if (credit.show) {
		const firstYear = format(parseISO(credit.show.first_air_date), 'yyyy');
		const lastYear = format(parseISO(credit.show.last_air_date), 'yyyy');
		return firstYear === lastYear ? firstYear : `${firstYear}-${lastYear}`;
	}
};

export const PersonCredit = ({ bgColor, credit }: Props) => {
	const year = getYears(credit);
	const mediaName = credit.movie ? credit.movie.title : credit.show?.name;
	const mediaPath = credit.movie
		? `/films/${credit.movie_id}`
		: `/tv/${credit.show_id}`;

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
					<div>{credit.character || `${credit.department} - ${credit.job}`}</div>
				</div>
				<div>
					<MediaStats
						bgColor={bgColor}
						// biome-ignore lint/style/noNonNullAssertion: <explanation>
						object={credit.movie || credit.show!}
					/>
				</div>
			</div>
			<HoverCard.Portal>
				<HoverCard.Content>
					{credit.movie_id && <HoverMedia id={credit.movie_id} mediaType="film" />}
					{credit.show_id && <HoverMedia id={credit.show_id} mediaType="tv" />}
					<HoverCard.Arrow className="text-neutral-700" />
				</HoverCard.Content>
			</HoverCard.Portal>
		</HoverCard.Root>
	);
};
