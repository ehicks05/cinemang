import { MediaLayout, MediaSkeleton, MediaSkeletons } from '~/core-components';
import { Paginator } from '~/core-components/Paginator/Paginator';
import type { Film, Show } from '~/types/types';
import { DEFAULT_PALETTE } from '~/utils/palettes/palette';
import { usePalettes } from '~/utils/palettes/usePalettes';
import { MediaCard } from '../components';
import { SearchForm } from './SearchForm';

interface Props {
	media: Film[] | Show[];
	count: number;
}

export const MediaList = ({ media, count }: Props) => {
	const { isLoading, palettes } = usePalettes({ items: media });

	return (
		<div className="flex flex-col sm:gap-4">
			<SearchForm />

			<Paginator count={count} isLoading={isLoading} />
			{isLoading && <MediaSkeletons />}
			{!isLoading && (
				<MediaLayout>
					{media.map((media) =>
						isLoading ? (
							<MediaSkeleton key={media.id} />
						) : (
							<MediaCard
								key={media.id}
								media={media}
								palette={palettes?.[media.id].palette || DEFAULT_PALETTE}
							/>
						),
					)}
				</MediaLayout>
			)}
			<Paginator count={count} isLoading={isLoading} />
		</div>
	);
};
