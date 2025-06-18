import { MediaLayout, Paginator } from '~/core-components';
import type { Film, Show } from '~/types/types';
import { DEFAULT_PALETTE } from '~/utils/palettes/palette';
import { usePalettes } from '~/utils/palettes/usePalettes';
import { MediaCard } from '../components';
import { SearchForm } from './SearchForm';

interface Props {
	media: Film[] | Show[];
	hasMore: boolean;
}

export const MediaList = ({ media, hasMore }: Props) => {
	const { palettes, isLoading } = usePalettes({
		paths: media.map((film) => film.posterPath),
	});

	return (
		<div className="flex flex-col sm:gap-4">
			<SearchForm />

			<Paginator count={media.length} hasMore={hasMore} isLoading={false} />
			<MediaLayout>
				{!isLoading &&
					media.map((media, i) => (
						<MediaCard
							key={media.id}
							media={media}
							palette={palettes?.[i] || DEFAULT_PALETTE}
						/>
					))}
			</MediaLayout>
			<Paginator count={media.length} hasMore={hasMore} isLoading={false} />
		</div>
	);
};
