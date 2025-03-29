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

interface Props {
	bgColor: string;
	object: {
		vote_average: number;
		vote_count: number;
	};
	classname?: string;
}

export const MediaStats = ({ bgColor, object, classname }: Props) => {
	const { vote_average: voteAverage, vote_count: voteCount } = object;

	const stats = [
		{
			key: 'Vote Average',
			label: voteAverage ? nf.format(voteAverage) : '',
			color: heartColor(voteAverage),
			icon: FaHeart,
		},
		{
			key: 'Vote Count',
			label: voteCount ? toShort(voteCount) : '',
			color: starColor(voteCount),
			icon: FaStar,
		},
	].filter((o) => o.label && !['?', 'en'].includes(o.label));

	return (
		<span className={`flex gap-1 ${classname || ''}`}>
			{stats.map((stat) => (
				<StatChip
					key={stat.key}
					title={stat.key}
					label={stat.label}
					icon={stat.icon}
					bgColor={bgColor}
					color={stat.color}
				/>
			))}
		</span>
	);
};
