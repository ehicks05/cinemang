import 'dotenv/config';

import { scheduleJob } from 'node-schedule';
import { runSyncJob } from './scripts/runSyncJob.js';
import { argv } from './services/args.js';
import logger from './services/logger.js';

export function scheduleUpdateTask() {
	return scheduleJob('0 10 * * *', async () => {
		await runSyncJob();
	});
}

const init = async () => {
	if (argv.syncOnStart) {
		logger.info('--syncOnStart arg detected.');
		runSyncJob();
	}
	scheduleUpdateTask();
};

init();
