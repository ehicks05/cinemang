import {
	getGenres,
	getLanguages,
	getMovie,
	getPerson,
	getProviders,
	getSeason,
	getShow,
} from './simple_endpoints.js';

import { getRecentlyChangedIds } from './changes.js';
import { discoverMediaIds } from './discover.js';

const tmdb = {
	discoverMediaIds,
	getMovie,
	getGenres,
	getLanguages,
	getPerson,
	getProviders,
	getRecentlyChangedIds,
	getSeason,
	getShow,
};

export { tmdb };
