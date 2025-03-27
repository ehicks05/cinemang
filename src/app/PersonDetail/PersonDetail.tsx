import { orderBy, truncate } from 'lodash-es';
import type React from 'react';
import { useState } from 'react';
import type { IconType } from 'react-icons';
import { FaCalendar, FaHeart, FaStar } from 'react-icons/fa';
import { useDocumentTitle } from 'usehooks-ts';
import { OriginalImageLink, StatChip, TmdbImage } from '~/core-components';
import type { Credit, Person } from '~/types/types';
import { usePalette } from '~/utils/palettes/usePalettes';
import { Lifespan } from './Lifespan';
import { PersonCredit } from './PersonCredit';
import { PersonStats } from './PersonStats';

const BIO_LENGTH_CUTOFF = 1280;

const nf = Intl.NumberFormat('en-US', { maximumFractionDigits: 1 });

const toStats = (person: Person) => ({
	credits: person.credits.length,
	knownForDepartment: person.known_for_department,
	popularity: nf.format(person.popularity),
});

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

export const PersonDetail = ({ person }: { person: Person }) => {
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

	const [truncateBio, setTruncateBio] = useState(true);
	const bio = truncateBio
		? truncate(person.biography, { length: BIO_LENGTH_CUTOFF, separator: ' ' })
		: person.biography;

	const { isLoading, palette } = usePalette({ path: person.profile_path });
	if (isLoading || !palette) return '';

	return (
		<div
			className="m-auto flex max-w-(--breakpoint-lg) flex-col gap-4 p-4 sm:rounded-lg"
			style={palette.bgStyles}
		>
			<div className="flex flex-col gap-4 sm:flex-row">
				<div className="flex flex-col gap-4 sm:w-2/5">
					<div className="relative">
						<TmdbImage
							className="w-full rounded-lg sm:w-80 md:w-96"
							path={person.profile_path}
							width={500}
						/>
						<OriginalImageLink path={person.profile_path} />
					</div>
					<PersonStats bgColor={palette.darkMuted || ''} data={toStats(person)} />
				</div>

				<div className="flex flex-col gap-4 sm:w-3/5">
					<div className="flex flex-col gap-1">
						<div className="text-2xl font-semibold">{person.name}</div>
						<button
							type="button"
							className={`flex ${
								person.biography.length > BIO_LENGTH_CUTOFF ? 'cursor-pointer' : ''
							} flex-col gap-2 text-justify`}
							onClick={() => setTruncateBio(!truncateBio)}
						>
							{bio
								.split('\n')
								.filter(Boolean)
								.map((b) => (
									<div key={b}>{b}</div>
								))}
						</button>
					</div>
					<Lifespan palette={palette} person={person} />
				</div>
			</div>

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
