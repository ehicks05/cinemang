import { MediaLayout, Paginator } from '~/core-components';
import type { Film, Show } from '~/types/types';
import { DEFAULT_PALETTE, type PaletteWithGradient } from '~/utils/palettes/palette';
import { MediaCard } from '../components';
import { SearchForm } from './SearchForm';

interface Props {
	media: Film[] | Show[];
	count: number;
	palettes: PaletteWithGradient[];
}

export const MediaList = ({ media, count, palettes }: Props) => {
	return (
		<div className="flex flex-col sm:gap-4">
			<SearchForm />

			<Paginator count={count} isLoading={false} />
			<MediaLayout>
				{media.map((media, i) => (
					<MediaCard
						key={media.id}
						media={media}
						palette={palettes[i] || DEFAULT_PALETTE}
					/>
				))}
			</MediaLayout>
			<Paginator count={count} isLoading={false} />
		</div>
	);
};
