import { addMinutes, format, intervalToDuration } from 'date-fns';
import { useSystemData } from '~/hooks/useSystemData';
import type { Film, Person, Show } from '~/types/types';

interface Props {
	media: Film | Show | Person;
}

export const SubHeading = ({ media }: Props) => {
	const { genres } = useSystemData();

	if ('releasedAt' in media) {
		const year = format(media.releasedAt, 'yyyy');
		const runtime = intervalToDuration({
			end: addMinutes(new Date(), Number(media.runtime)),
			start: new Date(),
		});

		return (
			<>
				<span
					className="font-semibold"
					title={media.releasedAt.toLocaleDateString()}
				>
					{year} {' • '}
					{genres.find((genre) => genre.id === media.genreId)?.name}
				</span>
				{' • '}
				<span className="whitespace-nowrap">{`${runtime.hours || 0}h ${runtime.minutes}m`}</span>

				{media.languageId !== 'en' && (
					<span>
						{' • '}
						{media.languageId}
					</span>
				)}
			</>
		);
	}

	if ('firstAirDate' in media) {
		const firstYear = format(media.firstAirDate, 'yyyy');
		const lastYear = format(media.lastAirDate, 'yyyy');
		const years = firstYear === lastYear ? firstYear : `${firstYear}-${lastYear}`;

		return (
			<>
				<span className="font-semibold">
					{years} {' • '}
					{genres.find((genre) => genre.id === media.genreId)?.name} {' • '}
				</span>
				<span>{media.status.replace(' Series', '')}</span>

				{media.languageId !== 'en' && (
					<span>
						{' • '}
						{media.languageId}
					</span>
				)}
			</>
		);
	}

	if ('knownForDepartment' in media) {
		return (
			<span>
				{media.knownForDepartment}
				{' • '}
				{media.credits.length} Credits
			</span>
		);
	}
};
