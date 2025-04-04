import { formatDuration, intervalToDuration, isFirstDayOfMonth } from 'date-fns';
import { argv } from '~/services/args.js';
import logger from '~/services/logger.js';
import prisma from '~/services/prisma.js';
import { runSync } from './sync.js';

const checkFullMode = () => {
	if (argv.full !== 'auto') {
		logger.info('--full arg detected.');
	}

	const isStartOfMonth = isFirstDayOfMonth(new Date());
	if (isStartOfMonth) {
		logger.info('start of month detected.');
	}

	const fullMode = argv.full === 'on' || (isStartOfMonth && argv.full !== 'off');
	logger.info(`running ${fullMode ? 'full' : 'partial'} load`);

	return fullMode;
};

// mostly housekeeping
export const wrapper = async () => {
	const { id: logId } = await prisma.syncRunLog.create({ data: {} });

	try {
		logger.info('starting tmdb_loader script');

		const fullMode = checkFullMode();

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
