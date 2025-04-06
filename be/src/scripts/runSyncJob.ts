import { formatDuration, intervalToDuration } from 'date-fns';
import logger from '~/services/logger.js';
import prisma from '~/services/prisma.js';
import { runSync } from './sync.js';

export const runSyncJob = async () => {
	const { id: logId } = await prisma.syncRunLog.create({ data: {} });

	try {
		logger.info('starting tmdb_loader script');

		await runSync();
	} catch (err) {
		logger.error(err);
	} finally {
		const log = await prisma.syncRunLog.update({
			data: { endedAt: new Date() },
			where: { id: logId },
		});
		const duration = intervalToDuration({
			start: log.createdAt,
			end: log.endedAt || 0,
		});
		logger.info(`finished tmdb_loader script in ${formatDuration(duration)}`);
	}
};
