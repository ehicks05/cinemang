import { addMinutes, format, intervalToDuration, parseISO } from 'date-fns';
import type { Film, Show } from '~/types/types';

interface Props {
	media: Film | Show;
}

export const SubHeading = ({ media }: Props) => {
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
