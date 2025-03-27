import { orderBy } from 'lodash-es';
import type React from 'react';
import { useState } from 'react';
import type { IconType } from 'react-icons';
import { FaCalendar, FaHeart, FaStar } from 'react-icons/fa';
import { useDocumentTitle } from 'usehooks-ts';
import { StatChip } from '~/core-components';
import type { Credit, Person } from '~/types/types';
import type { PaletteWithGradient } from '~/utils/palettes/palette';
import { PersonCredit } from './PersonCredit';

type SortKey = 'released_at' | 'vote_average' | 'vote_count';
const SORT_OPTIONS: { color: string; icon: IconType; sort: SortKey }[] = [
	{ color: 'text-sky-500', icon: FaCalendar, sort: 'released_at' },
	{ color: 'text-red-600', icon: FaHeart, sort: 'vote_average' },
	{ color: 'text-yellow-300', icon: FaStar, sort: 'vote_count' },
];

const SortOptions = ({
	darkVibrant,
	setSort,
	sort,
}: {
	darkVibrant: string;
	setSort: React.Dispatch<React.SetStateAction<SortKey>>;
	sort: SortKey;
}) => (
	<div
		className="flex w-fit gap-2 self-end rounded-sm p-2"
		style={{ borderColor: darkVibrant }}
	>
		{SORT_OPTIONS.map((o) => (
			<button type="button" key={o.sort} onClick={() => setSort(o.sort)}>
				<StatChip
					bgColor={darkVibrant}
					color={sort === o.sort ? o.color : ''}
					icon={o.icon}
				/>
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
	useDocumentTitle(person.name);

	const [sort, setSort] = useState<SortKey>('released_at');

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

	return (
		<div className="flex flex-col gap-4">
			{castCredits.length !== 0 && (
				<>
					<h1 className="flex items-end justify-between text-xl font-bold">
						Cast
						<SortOptions
							darkVibrant={palette.darkMuted}
							setSort={setSort}
							sort={sort}
						/>
					</h1>

					{castCredits.map((c) => (
						<PersonCredit bgColor={palette.darkMuted} credit={c} key={c.credit_id} />
					))}
				</>
			)}
			{crewCredits.length !== 0 && (
				<>
					<h1 className="flex items-center justify-between text-xl font-bold">
						Crew
						<SortOptions
							darkVibrant={palette.darkMuted}
							setSort={setSort}
							sort={sort}
						/>
					</h1>
					{crewCredits.map((c) => (
						<PersonCredit bgColor={palette.darkMuted} credit={c} key={c.credit_id} />
					))}
				</>
			)}
		</div>
	);
};
