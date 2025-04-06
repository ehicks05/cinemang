import logger from '~/services/logger.js';
import { prismaDirect } from '~/services/prisma.js';

export const vacuumAnalyze = async () => {
	logger.info('running vacuum analyze');
	await prismaDirect.$executeRaw`vacuum analyze`;
	logger.info('finished running vacuum analyze');
};
