import { sortBy } from 'lodash-es';
import { FaHeart } from 'react-icons/fa';
import { OriginalImageLink, StatChip, TmdbImage } from '~/core-components';
import type { Season } from '~/types/types';

const SeasonCard = ({ season }: { season: Season }) => (
	<div className="flex w-full flex-col gap-2">
		<div className="flex w-full flex-col gap-2 sm:flex-row">
			<div className="relative w-full shrink-0 sm:w-40">
				<TmdbImage
					alt="poster"
					className="w-full rounded-lg"
					path={season.poster_path || ''}
					width={500}
				/>
				<OriginalImageLink path={season.poster_path || undefined} />
			</div>

			<div className="flex flex-col justify-between w-full p-4 rounded-lg bg-neutral-900">
				<div>
					<div className="flex items-center gap-2">
						<span className="font-semibold">{season.name}</span>
						{season.air_date && (
							<span className="text-sm opacity-75">
								{new Date(season.air_date).toLocaleDateString()}
							</span>
						)}
					</div>
					<div className="text-justify pr-1 text-sm lg:text-base overflow-y-auto max-h-32">
						{season.overview}
					</div>
				</div>
				<span className="mt-2 flex w-full items-center gap-2">
					<StatChip
						icon={FaHeart}
						label={season.vote_average || '?'}
						bgColor="#333"
						color="text-red-600"
						title="Vote Average"
					/>
					<StatChip
						label={`${season.episode_count} Episodes`}
						bgColor="#333"
						color=""
						title=""
					/>
				</span>
			</div>
		</div>
	</div>
);

export const Seasons = ({ seasons }: { seasons: Season[] }) => (
	<div className="flex flex-col gap-4">
		<div className="text-xl font-bold">
			Season{seasons.length > 1 && 's'} ({seasons.length})
		</div>
		<div className="grid gap-4 sm:gap-2">
			{sortBy(seasons, (o) => o.season_number).map((season) => (
				<SeasonCard key={season.id} season={season} />
			))}
		</div>
	</div>
);
