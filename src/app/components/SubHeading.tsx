import { addMinutes, format, intervalToDuration, parseISO } from 'date-fns';
import { useSystemData } from '~/hooks/useSystemData';
import type { Film, Person, Show } from '~/types/types';

interface Props {
	media: Film | Show | Person;
}

export const SubHeading = ({ media }: Props) => {
	const { genres } = useSystemData();

	if ('released_at' in media) {
		const year = format(parseISO(media.released_at), 'yyyy');
		const runtime = intervalToDuration({
			end: addMinutes(new Date(), Number(media.runtime)),
			start: new Date(),
		});

		return (
			<>
				<span className="font-semibold" title={media.released_at}>
					{year} {genres.find((genre) => genre.id === media.genre_id)?.name}
				</span>
				{' • '}
				<span className="whitespace-nowrap">{`${runtime.hours || 0}h ${runtime.minutes}m`}</span>

				{media.language_id !== 'en' && (
					<span>
						{' • '}
						{media.language_id}
					</span>
				)}
			</>
		);
	}

	if ('first_air_date' in media) {
		const firstYear = format(parseISO(media.first_air_date), 'yyyy');
		const lastYear = format(parseISO(media.last_air_date), 'yyyy');
		const years = firstYear === lastYear ? firstYear : `${firstYear}-${lastYear}`;

		return (
			<>
				<span className="font-semibold">
					{years} {genres.find((genre) => genre.id === media.genre_id)?.name} {' • '}
				</span>
				<span>{media.status.replace(' Series', '')}</span>

				{media.language_id !== 'en' && (
					<span>
						{' • '}
						{media.language_id}
					</span>
				)}
			</>
		);
	}

	if ('known_for_department' in media) {
		return (
			<span>
				{media.known_for_department}
				{' • '}
				{media.credits.length} Credits
			</span>
		);
	}
};
