import { TmdbApi } from '@ehicks05/tmdb-api';

const api_key = process.env.TMDB_API_KEY;
if (!api_key) {
	throw new Error('missing TMDB_API_KEY');
}

export const tmdb = new TmdbApi({ api_key });
