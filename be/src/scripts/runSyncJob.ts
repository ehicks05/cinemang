import { formatDuration, intervalToDuration } from 'date-fns';
import logger from '~/services/logger.js';
import prisma from '~/services/prisma.js';
import { runSync } from './sync.js';

const taskName = 'db sync task';

export const runSyncJob = async () => {
	logger.info(`starting ${taskName}`);

	const { id } = await prisma.syncRunLog.create({ data: {} });

	try {
		await runSync();
	} catch (err) {
		logger.error(err);
	}

	const endedAt = new Date();
	const log = await prisma.syncRunLog.update({ data: { endedAt }, where: { id } });
	const duration = intervalToDuration({ start: log.createdAt, end: endedAt });

	logger.info(`finished ${taskName} in ${formatDuration(duration) || 'less than 1 second'}`);
};
