import { type Interval, format } from 'date-fns';
import { intersection } from 'lodash-es';
import { tmdb } from '../client/index.js';
import { discoverMediaIds } from './discover.js';
import type { RecentChangesResponse } from './types/responses.js';

export type Resource = 'movie' | 'tv' | 'person';

export const getRecentlyChangedIds = async (
	resource: Resource,
	interval: Interval,
) => {
	const url = `/${resource}/changes`;
	const params = {
		start_date: format(interval.start, 'yyyy-MM-dd'),
		end_date: format(interval.end, 'yyyy-MM-dd'),
	};

	const { data } = await tmdb<RecentChangesResponse>(url, { params });

	const ids = data.results.map((o) => o.id);
	const pages = data.total_pages;

	let page = 1;
	while (page < pages) {
		page += 1;
		const { data } = await tmdb<RecentChangesResponse>(url, {
			params: { ...params, page },
		});
		ids.push(...data.results.map((o) => o.id));
	}

	// filter using /discover
	if (resource === 'person') return ids;

	const discoverIds = await discoverMediaIds(resource, true);

	return intersection(ids, discoverIds);
};
