import { MediaLayout, Paginator } from '~/core-components';
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
			<MediaLayout>
				{media.map((media) => (
					<MediaCard
						key={media.id}
						media={media}
						palette={palettes?.[media.id].palette || DEFAULT_PALETTE}
					/>
				))}
			</MediaLayout>
			<Paginator count={count} isLoading={isLoading} />
		</div>
	);
};
