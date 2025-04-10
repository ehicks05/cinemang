import type { FilmDetail } from '~/server/drizzle/fetchFilm';
import type { Person } from '~/server/drizzle/fetchPerson';
import type { ShowDetail } from '~/server/drizzle/fetchShow';
import type { Genre, Language, Provider } from '~/server/drizzle/fetchSystemData';
import type { Film } from '~/server/drizzle/findFilms';
import type { Show } from '~/server/drizzle/findShows';

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
