import { subMonths } from 'date-fns';
import logger from '~/services/logger.js';
import { tmdb } from '~/services/tmdb.js';
import { MIN_VOTES } from '../constants.js';

type Media = 'movie' | 'tv';

export const discoverMediaIds = async (media: Media, isFullMode: boolean) => {
	logger.info('discovering media ids');

	const start = isFullMode ? undefined : subMonths(new Date(), 3);
	const results = await tmdb.discover({ media, start, minVotes: MIN_VOTES });
	const mediaIds = results.map((o) => o.id);

	logger.info('done discovering media ids');

	return mediaIds;
};
