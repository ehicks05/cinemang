import { FaHeart, FaStar } from 'react-icons/fa';
import { GENRE_NAMES } from '~/constants/constants';
import { useSystemData } from '~/hooks/useSystemData';
import type { Genre } from '~/types/types';
import { StatChip } from './StatChip';

const nf = Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

const findGenre = (genres: Genre[], genreId: number) =>
	genres.find((genre) => genre.id === genreId);

const getGenreName = (genreName: string) => GENRE_NAMES[genreName] || genreName;

export const toShort = (voteCount: number) =>
	Number(voteCount) > 1000 ? `${Math.round(voteCount / 1000)}k` : String(voteCount);

const heartColor = (voteAverage: number) =>
	voteAverage >= 8
		? 'text-red-600'
		: voteAverage >= 7
			? 'text-red-600'
			: voteAverage >= 6
				? 'text-red-700'
				: 'text-red-800';

const starColor = (voteCount: number) =>
	voteCount >= 10_000
		? 'text-yellow-300'
		: voteCount >= 1000
			? 'text-yellow-400'
			: voteCount >= 1000
				? 'text-yellow-500'
				: 'text-yellow-700';

export interface Stats {
	genre_id: number;
	language_id: string;
	vote_average: number;
	vote_count: number;
}

export const toStats = (genres: Genre[], media: Stats) => ({
	genre: getGenreName(findGenre(genres, media.genre_id)?.name || '?'),
	language: media.language_id,
	voteAverage: media.vote_average || 0,
	voteCount: media.vote_count || 0,
});

interface Props {
	autoWidth?: boolean;
	bgColor: string;
	object: Stats;
}

export const MediaStats = ({ autoWidth = true, bgColor, object }: Props) => {
	const { genres } = useSystemData();

	const { genre, language, voteAverage, voteCount } = toStats(genres, object);

	const stats = [
		{
			key: 'voteAverage',
			label: nf.format(voteAverage),
			color: heartColor(voteAverage),
			icon: FaHeart,
			width: 'w-20',
		},
		{
			key: 'voteCount',
			label: toShort(voteCount),
			color: starColor(voteCount),
			icon: FaStar,
			width: 'w-20',
		},
		{
			key: 'genre',
			label: genre,
			color: 'text-blue-400',
			icon: undefined,
			width: 'w-32',
		},
		{
			key: 'language',
			label: language,
			color: 'text-emerald-500',
			icon: undefined,
			width: 'w-32',
		},
	].filter((o) => o.label && !['?', 'en'].includes(o.label));

	return (
		<span className={`flex ${autoWidth ? 'flex-wrap' : ''} gap-2`}>
			{stats.map((stat) => (
				<StatChip
					key={stat.key}
					bgColor={bgColor}
					color={stat.color}
					icon={stat.icon}
					label={stat.label || ''}
					width={autoWidth ? undefined : stat.width}
				/>
			))}
		</span>
	);
};
