import {
	getGenres,
	getLanguages,
	getMovie,
	getPerson,
	getProviders,
	getSeason,
	getShow,
} from './endpoints/simple_endpoints.js';

import { getRecentlyChangedIds } from './endpoints/changes.js';
import { discoverMediaIds } from './endpoints/discover.js';

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
