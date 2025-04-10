import type { FilmDetail } from '~/server/prisma/fetchFilm';
import type { Person } from '~/server/prisma/fetchPerson';
import type { ShowDetail } from '~/server/prisma/fetchShow';
import type { Genre, Language, Provider } from '~/server/prisma/fetchSystemData';
import type { Film } from '~/server/prisma/findFilms';
import type { Show } from '~/server/prisma/findShows';

export type PersonCredit = Person['credits'][number];
export type MediaCredit = FilmDetail['credits'][number];

export type Credit = PersonCredit | MediaCredit;

export type Season = ShowDetail['seasons'][number];

export interface Video {
	id: string;
	iso_3166_1: string;
	iso_639_1: string;
	key: string;
	name: string;
	official: boolean;
	published_at: string;
	site: string;
	size: number;
	type: string;
}

export type {
	Film,
	FilmDetail,
	Genre,
	Language,
	Person,
	Provider,
	Show,
	ShowDetail,
};
