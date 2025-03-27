import * as HoverCard from '@radix-ui/react-hover-card';
import { Link } from '@tanstack/react-router';
import { format, parseISO } from 'date-fns';
import { useWindowSize } from 'usehooks-ts';
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
	const { width } = useWindowSize();
	const year = getYears(credit);
	const mediaName = credit.movie ? credit.movie.title : credit.show?.name;
	const mediaPath = credit.movie
		? `/films/${credit.movie_id}`
		: `/tv/${credit.show_id}`;
	const creditText = (
		<span>{credit.character || `${credit.department} - ${credit.job}`}</span>
	);

	return (
		<HoverCard.Root openDelay={100}>
			<div
				className="flex flex-col justify-between gap-2 rounded-sm border p-2 sm:flex-row sm:items-center"
				key={credit.credit_id}
				style={{ borderColor: bgColor }}
			>
				<div className="flex flex-col items-baseline gap-2 sm:flex-row">
					<span className="hidden text-xs sm:inline">{year} </span>
					<div className="flex flex-col items-baseline gap-2 lg:flex-row">
						<span className="flex items-baseline gap-2">
							<HoverCard.Trigger asChild>
								<Link to={mediaPath}>
									<span className="font-bold sm:text-lg">{mediaName}</span>
									<span className="inline text-xs sm:hidden"> {year}</span>
								</Link>
							</HoverCard.Trigger>
						</span>{' '}
						{creditText}
					</div>
				</div>
				<div>
					<MediaStats
						autoWidth={width < 640}
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
