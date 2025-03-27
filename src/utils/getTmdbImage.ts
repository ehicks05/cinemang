import { IMAGE_WIDTH } from '../constants/constants';

const DEFAULT_IMAGE = '/92x138.png';

interface Params {
	path?: string;
	width?: string;
}

export const getTmdbImage = ({ path, width = `w${IMAGE_WIDTH}` }: Params) => {
	if (!path) return DEFAULT_IMAGE;
	return `https://image.tmdb.org/t/p/${width}${path}`;
};
