import { useState } from 'react';
import { useTimeout } from 'usehooks-ts';
import { MediaCard } from '~/app/components';
import { usePalette } from '~/utils/palettes/usePalettes';
import { HoverLoading } from './HoverLoading';
import { container } from './constants';
import { useFetchFilm, useFetchShow } from './useFetchMedia';

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

	const { palette } = usePalette({ path: media?.posterPath });

	const [isReady, setIsReady] = useState(false);
	useTimeout(() => setIsReady(true), 1000);

	if (isReady && (error || isLoading)) {
		return (
			<HoverLoading
				background={palette?.bgStyles.background || '#333'}
				error={error}
				isLoading={isLoading}
			/>
		);
	}

	return (
		<div className={container}>
			{media && palette && <MediaCard media={media} palette={palette} />}
		</div>
	);
};
