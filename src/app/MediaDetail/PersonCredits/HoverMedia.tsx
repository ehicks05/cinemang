import { useState } from 'react';
import { useTimeout } from 'usehooks-ts';
import { MediaCard } from '~/app/components';
import { useFetchMedia } from '~/hooks/useFetchMedia';
import { usePalette } from '~/utils/palettes/usePalettes';
import { container } from './constants';
import { HoverLoading } from './HoverLoading';

interface Props {
	id: number;
	mediaType: 'tv' | 'film';
}

export const HoverMedia = ({ id, mediaType }: Props) => {
	const { data: media, error, isLoading } = useFetchMedia({ id, type: mediaType });

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
