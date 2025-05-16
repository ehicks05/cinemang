import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import YouTube from 'react-youtube';
import type { Video } from '~/types/types';

interface Props {
	trailer: Video;
}

export const Trailer = ({ trailer }: Props) => {
	if (!trailer) return null;

	return (
		<YouTube
			videoId={trailer.key}
			className="h-full w-full"
			iframeClassName="rounded-lg w-full h-full"
		/>
	);
};
