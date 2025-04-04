import axios from 'axios';
import pThrottle from 'p-throttle';
import { configureHttp } from '~/utils/configure-http.js';

configureHttp();

const LIMIT = 40;
const INTERVAL = 1000;

const BASE_URL = 'https://api.themoviedb.org/3';
const PARAMS = { api_key: process.env.TMDB_API_KEY };

const _tmdb = axios.create({ baseURL: BASE_URL, params: PARAMS });

let start = Date.now();
let i = 0;

_tmdb.interceptors.request.use((request) => {
	if (i > LIMIT && i % LIMIT === 0) {
		const rps = LIMIT / (Date.now() - start);
		console.log(`client rps: ${rps}`);
		start = Date.now();
	}
	i++;
	return request;
});

const throttle = pThrottle({ limit: LIMIT, interval: INTERVAL });

const tmdb = throttle(_tmdb.get);

export { tmdb };
