import { FaHeart, FaStar } from 'react-icons/fa';
import { StatChip } from '~/core-components';

const nf = Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

export const toShort = (voteCount: number) =>
	Number(voteCount) > 1000 ? `${Math.round(voteCount / 1000)}k` : String(voteCount);

const heartColor = (voteAverage: number) =>
	voteAverage >= 8
		? 'text-red-500'
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
				: 'text-yellow-600';

export interface Stats {
	vote_average: number;
	vote_count: number;
}

export const toStats = (media: Stats) => ({
	voteAverage: media.vote_average,
	voteCount: media.vote_count,
});

interface Props {
	autoWidth?: boolean;
	bgColor: string;
	object: Stats;
}

export const MediaStats = ({ autoWidth = true, bgColor, object }: Props) => {
	const { voteAverage, voteCount } = toStats(object);

	const stats = [
		{
			key: 'Vote Average',
			label: voteAverage ? nf.format(voteAverage) : null,
			color: heartColor(voteAverage),
			icon: FaHeart,
			width: 'w-20',
		},
		{
			key: 'Vote Count',
			label: voteCount ? toShort(voteCount) : null,
			color: starColor(voteCount),
			icon: FaStar,
			width: 'w-20',
		},
	].filter((o) => o.label && !['?', 'en'].includes(o.label));

	return (
		<span className={`flex ${autoWidth ? 'flex-wrap' : ''} gap-1`}>
			{stats.map((stat) => (
				<StatChip
					key={stat.key}
					bgColor={bgColor}
					color={stat.color}
					icon={stat.icon}
					label={stat.label || ''}
					title={stat.key}
					width={autoWidth ? undefined : stat.width}
				/>
			))}
		</span>
	);
};
