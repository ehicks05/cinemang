import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import type { Video } from '~/types/types';

interface Props {
	trailer: Video;
}

export const Trailer = ({ trailer }: Props) => {
	if (!trailer) return null;

	return (
		<LiteYouTubeEmbed
			id={trailer.key}
			title={trailer.name}
			wrapperClass="yt-lite rounded-lg"
		/>
	);
};
