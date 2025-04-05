import pThrottle from 'p-throttle';
import { _tmdb } from './client.js';

const LIMIT = 40;
const LOG = false;

if (LOG && process.env.NODE_ENV !== 'production') {
	let start = Date.now();
	let i = 0;

	_tmdb.interceptors.request.use((request) => {
		if (i > LIMIT && i % LIMIT === 0) {
			const rps = LIMIT / ((Date.now() - start) / 1000);
			console.log(`client rps: ${Math.round(rps)}`);
			start = Date.now();
		}
		i++;
		return request;
	});
}

const throttle = pThrottle({ limit: LIMIT, interval: 1000 });

const tmdbClient = throttle(_tmdb.get);

export { tmdbClient };
