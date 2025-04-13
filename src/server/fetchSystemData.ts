import { createServerFn } from '@tanstack/react-start';
import {
	type FetchSystemDataReturn,
	fetchSystemDataQuery,
} from './fetchSystemDataQuery';
import { storage } from './storage';

export const fetchSystemData = createServerFn().handler(async () => {
	const start = Date.now();

	const cachedResponse = await storage.get<FetchSystemDataReturn>('systemData');
	if (cachedResponse) {
		const result = cachedResponse;

		console.log(`[HIT] took ${Date.now() - start} ms`);
		return result;
	}

	const result = await fetchSystemDataQuery();
	storage.set('systemData', result);
	console.log(`[MISS] took ${Date.now() - start} ms`);

	return result;
});
