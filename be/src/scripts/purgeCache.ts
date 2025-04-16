import { purgeCloudflareCache } from '~/services/cloudflare.js';
import logger from '~/services/logger.js';

export const purgeCache = async () => {
	logger.info('purging cloudflare cache');

	await purgeCloudflareCache();

	logger.info('finished purging cloudflare cache');
};
