import { useState } from 'react';
import { useTimeout } from 'usehooks-ts';
import { MediaCard } from '~/app/components';
import { useFetchFilm } from '~/hooks/useFetchFilms';
import { useFetchShow } from '~/hooks/useFetchShows';
import { getTmdbImage } from '~/utils/getTmdbImage';
import { usePalette } from '~/utils/palettes/usePalettes';
import { HoverLoading } from './HoverLoading';
import { container } from './constants';

interface Props {
	id: number;
	mediaType: 'tv' | 'film';
}

export const HoverMedia = ({ id, mediaType }: Props) => {
	const {
		data: media,
		error,
		isLoading,
	} = mediaType === 'film' ? useFetchFilm(id) : useFetchShow(id);

	const path = getTmdbImage({ path: media?.poster_path });
	const { palette, isLoading: isPaletteLoading } = usePalette({ path });

	const [isReady, setIsReady] = useState(false);
	useTimeout(() => setIsReady(true), 1000);

	if (isReady && (error || isLoading || isPaletteLoading)) {
		return (
			<HoverLoading
				background={palette?.bgStyles.background || '#333'}
				error={error}
				isLoading={isLoading || isPaletteLoading}
			/>
		);
	}

	return (
		<div className={container}>
			{media && palette && <MediaCard media={media} palette={palette} />}
		</div>
	);
};
