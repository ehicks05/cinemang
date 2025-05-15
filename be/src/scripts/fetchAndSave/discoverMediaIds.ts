import { subMonths } from 'date-fns';
import logger from '~/services/logger.js';
import { tmdb } from '~/services/tmdb.js';
import { MIN_VOTES } from '../constants.js';

type Media = 'movie' | 'tv';

export const discoverMediaIds = async (media: Media, isFullMode: boolean) => {
	logger.info('discovering media ids');

	const start = isFullMode
		? undefined
		: subMonths(new Date(), 3).toISOString().split('T')[0];

	const query = {
		'vote_count.gte': MIN_VOTES,
		...(media === 'movie' ? { 'release_date.gte': start } : undefined),
		...(media === 'tv' ? { 'first_air_date.gte': start } : undefined),
	};

	const results = (await tmdb.discover({ media, query })) || [];
	const mediaIds = results.map((o) => o.id);

	logger.info('done discovering media ids');

	return mediaIds;
};
