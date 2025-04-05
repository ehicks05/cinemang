import { GenreType } from '@prisma/client';
import axios, { type AxiosError } from 'axios';
import { groupBy } from 'lodash-es';
import type { ZodError } from 'zod';
import logger from '~/services/logger.js';
import { tmdbClient } from '../client/throttledClient.js';
import { GenreResponseSchema } from '../types/genre.js';
import { LanguageResponseSchema } from '../types/language.js';
import { MovieResponseSchema } from '../types/movie.js';
import { PersonResponseSchema } from '../types/person.js';
import { type ProviderResponse, ProviderResponseSchema } from '../types/provider.js';
import { SeasonResponseSchema } from '../types/season.js';
import { ShowResponseSchema } from '../types/show.js';
import { logAxiosError } from '../utils.js';

export const getMovie = async (id: number) => {
	try {
		const append = ['releases', 'credits', 'watch/providers'];
		const config = {
			params: { append_to_response: append.join(',') },
		};
		const { data } = await tmdbClient(`/movie/${id}`, config);
		return MovieResponseSchema.parse(data);
	} catch (e) {
		logAxiosError(e as AxiosError);
	}
};

export const getShow = async (id: number) => {
	try {
		const append = ['credits', 'watch/providers', 'content_ratings'];
		const config = {
			params: { append_to_response: append.join(',') },
		};
		const { data } = await tmdbClient(`/tv/${id}`, config);
		return ShowResponseSchema.parse(data);
	} catch (e) {
		logAxiosError(e as AxiosError);
	}
};

export const getSeason = async (showId: number, season: number) => {
	try {
		const append = ['credits'];
		const config = {
			params: { append_to_response: append.join(',') },
		};
		const path = `/tv/${showId}/season/${season}`;
		const { data } = await tmdbClient(path, config);

		// todo - wrap all parses in try catch?
		try {
			return SeasonResponseSchema.parse(data);
		} catch (e) {
			console.log({ showId, season });
			logger.error((e as ZodError).issues);
		}
	} catch (e) {
		logAxiosError(e as AxiosError);
	}
};

export const getPerson = async (id: number) => {
	try {
		const append = [''];
		const config = {
			params: { append_to_response: append.join(',') },
		};
		const { data } = await tmdbClient(`/person/${id}`, config);

		try {
			return PersonResponseSchema.parse(data);
		} catch (e) {
			// ignore expected issues
			const EXPECTED_ISSUES = ['missing known_for_department'];
			const issues = (e as ZodError).issues.filter(
				(issue) => !EXPECTED_ISSUES.includes(issue.message),
			);

			if (issues && issues.length > 0) {
				console.log(`error for ${id}`);
				console.log(issues);
			}
		}
	} catch (e) {
		if (axios.isAxiosError(e)) {
			logAxiosError(e);
		} else {
			logger.error(e);
		}

		return { id, error: e || new Error('something went wrong') };
	}
};

const getMovieGenres = async () => {
	const { data } = await tmdbClient('/genre/movie/list');
	return GenreResponseSchema.parse(data).genres;
};

const getShowGenres = async () => {
	const { data } = await tmdbClient('/genre/tv/list');
	return GenreResponseSchema.parse(data).genres;
};

export const getGenres = async () => {
	const movieGenres = (await getMovieGenres()).map((o) => ({
		...o,
		type: GenreType.MOVIE,
	}));
	const showGenres = (await getShowGenres()).map((o) => ({
		...o,
		type: GenreType.SHOW,
	}));

	const genresById = groupBy([...movieGenres, ...showGenres], (o) => o.id);
	const genres = Object.values(genresById).map((o) =>
		o.length === 1 ? o[0] : { ...o[0], type: GenreType.BOTH },
	);

	return genres;
};

export const getLanguages = async () => {
	const { data } = await tmdbClient('/configuration/languages');
	return LanguageResponseSchema.parse(data);
};

export const getProviders = async () => {
	const url = '/watch/providers/movie';
	const config = { params: { watch_region: 'US' } };
	const { data } = await tmdbClient<ProviderResponse>(url, config);
	return ProviderResponseSchema.parse(data).results;
};
