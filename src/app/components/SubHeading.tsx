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
		const _runtime = intervalToDuration({
			end: addMinutes(new Date(), Number(media.runtime)),
			start: new Date(),
		});
		const h = _runtime.hours ? `${_runtime.hours}h` : '';
		const m = _runtime.minutes ? ` ${_runtime.minutes}m` : '';
		const runtime = `${h}${m}`;

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
				<span className="whitespace-nowrap">{runtime}</span>

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
