import { FaQuestion } from 'react-icons/fa';

export const DEFAULT_IMAGE_PATH = '/92x138.png';

interface Props {
	className?: string;
	path?: string;
	width?: number | 'original';
	title?: string;
	alt?: string;
}

export const TmdbImage = ({
	className,
	path,
	width = 300,
	title,
	alt = 'poster',
}: Props) => {
	if (!path) {
		return (
			<div className="w-full h-full flex items-center justify-evenly bg-neutral-700 rounded-lg">
				<FaQuestion size={32} />
			</div>
		);
	}

	return (
		<img
			src={`https://image.tmdb.org/t/p/${width === 'original' ? '' : 'w'}${width}${path}`}
			className={className}
			// height={SCALED_IMAGE.h}
			// width={SCALED_IMAGE.w}
			height={width === 'original' ? '' : (width / 2) * 1.5}
			width={width === 'original' ? '' : width / 2}
			title={title}
			alt={alt}
		/>
	);
};
