import {
	getGenres,
	getLanguages,
	getMovie,
	getPerson,
	getProviders,
	getSeason,
	getShow,
} from './simple_endpoints.js';

import { discoverMediaIds } from './discover.js';

export {
	discoverMediaIds,
	getMovie,
	getGenres,
	getLanguages,
	getPerson,
	getProviders,
	getSeason,
	getShow,
};

const tmdb = {
	discoverMediaIds,
	getMovie,
	getGenres,
	getLanguages,
	getPerson,
	getProviders,
	getSeason,
	getShow,
};

export { tmdb };
