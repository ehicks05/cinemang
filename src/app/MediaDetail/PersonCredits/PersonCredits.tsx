import { orderBy } from 'lodash-es';
import type React from 'react';
import { useState } from 'react';
import type { IconType } from 'react-icons';
import { FaCalendar, FaHeart, FaStar } from 'react-icons/fa';
import type { Credit, Person } from '~/types/types';
import type { PaletteWithGradient } from '~/utils/palettes/palette';
import { PersonCredit } from './PersonCredit';

type SortKey = 'released_at' | 'vote_average' | 'vote_count';
const SORT_OPTIONS: { color: string; icon: IconType; sort: SortKey }[] = [
	{ color: 'text-white', icon: FaCalendar, sort: 'released_at' },
	{ color: 'text-red-600', icon: FaHeart, sort: 'vote_average' },
	{ color: 'text-yellow-300', icon: FaStar, sort: 'vote_count' },
];

const SortButtons = ({
	darkVibrant,
	setSort,
	sort,
}: {
	darkVibrant: string;
	setSort: React.Dispatch<React.SetStateAction<SortKey>>;
	sort: SortKey;
}) => (
	<div className="flex gap-2 py-2" style={{ borderColor: darkVibrant }}>
		{SORT_OPTIONS.map((o) => (
			<button
				key={o.sort}
				type="button"
				className={`p-2 rounded ${sort === o.sort ? o.color : 'text-neutral-400'}`}
				style={{ background: darkVibrant }}
				onClick={() => setSort(o.sort)}
			>
				<o.icon size={14} />
			</button>
		))}
	</div>
);

const toSortValue = (credit: Credit, sort: SortKey) => {
	if (credit.movie) {
		return credit.movie[sort];
	}
	if (credit.show) {
		const sortKey = sort === 'released_at' ? 'last_air_date' : sort;
		return credit.show[sortKey];
	}
};

interface Props {
	person: Person;
	palette: PaletteWithGradient;
}

export const PersonCredits = ({ person, palette }: Props) => {
	const [sort, setSort] = useState<SortKey>('released_at');
	const sortOptions = (
		<SortButtons darkVibrant={palette.darkMuted} setSort={setSort} sort={sort} />
	);

	const castCredits = orderBy(
		person.credits.filter((c) => c.character),
		(o) => toSortValue(o, sort),
		'desc',
	);
	const crewCredits = orderBy(
		person.credits.filter((c) => c.job),
		(o) => toSortValue(o, sort),
		'desc',
	);

	const creditSections = [
		{ label: 'Cast', credits: castCredits },
		{ label: 'Crew', credits: crewCredits },
	];

	return (
		<div className="flex flex-col gap-4">
			{creditSections.map(({ label, credits }) => (
				<div key={label}>
					<h1 className="flex items-end justify-between text-xl font-bold">
						{label}
						{sortOptions}
					</h1>

					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
						{credits.map((c) => (
							<PersonCredit
								bgColor={palette.darkMuted}
								credit={c}
								key={c.credit_id}
							/>
						))}
					</div>
				</div>
			))}
		</div>
	);
};
