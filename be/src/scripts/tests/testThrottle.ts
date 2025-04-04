import axios from 'axios';
import pThrottle from 'p-throttle';
import { configureHttp } from '~/utils/configure-http.js';

configureHttp();

const BASE_URL = 'http://localhost:3000';
const _tmdb = axios.create({ baseURL: BASE_URL });

const throttle = pThrottle({ limit: 40, interval: 1000 });

const tmdb = throttle(_tmdb.get);

const run = async () => {
	let start = Date.now();
	let i = 0;

	while (true) {
		if (i > 40 && i % 40 === 0) {
			const r = 40;
			const s = (Date.now() - start) / 1000;
			console.log(`client rps: ${r / s}`);
			start = Date.now();
		}
		await tmdb('/');
		i++;
	}
};

run();
