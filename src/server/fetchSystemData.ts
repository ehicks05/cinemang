import { createServerFn } from '@tanstack/react-start';
import {
	type FetchSystemDataReturn,
	fetchSystemDataQuery,
} from './fetchSystemDataQuery';
import { storage } from './storage';

export const fetchSystemData = createServerFn().handler(async () => {
	const cachedResponse = await storage.get<FetchSystemDataReturn>('systemData');
	if (cachedResponse) {
		return cachedResponse;
	}

	const result = await fetchSystemDataQuery();
	storage.set('systemData', result);

	return result;
});
