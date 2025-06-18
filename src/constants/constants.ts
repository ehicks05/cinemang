import type { Genre } from '~/types/types';

export const PAGE_SIZE = 20;

export const IMAGE_WIDTH = 300;
export const SCALED_IMAGE = {
	h: (IMAGE_WIDTH / 2) * 1.5,
	w: IMAGE_WIDTH / 2,
};

const GENRE_NAMES = { 'Science Fiction': 'Sci-Fi' } as Record<string, string>;

export const getGenreName = (genreName: string) =>
	GENRE_NAMES[genreName] || genreName;

export const findGenre = (genres: Genre[], genreId: number) =>
	genres.find((genre) => genre.id === genreId);

export const ROUTE_META = {
	'/': {
		mode: 'movie',
		from: '/',
		navigateFrom: '/',
	},
	'/films': {
		mode: 'movie',
		from: '/films/',
		navigateFrom: '/films',
	},
	'/tv': {
		mode: 'tv',
		from: '/tv/',
		navigateFrom: '/tv',
	},
} as const;
