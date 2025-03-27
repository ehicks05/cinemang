interface Props {
	className?: string;
	path: string;
	width?: number | 'original';
	title?: string;
	alt?: string;
}

export const TmdbImage = ({
	className,
	path = '/92x138.png',
	width = 300,
	title,
	alt = 'poster',
}: Props) => {
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
