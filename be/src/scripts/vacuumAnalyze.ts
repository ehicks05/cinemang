import logger from '~/services/logger.js';
import prisma from '~/services/prisma.js';

export const vacuumAnalyze = async () => {
	logger.info('running vacuum analyze');
	await prisma.$executeRaw`vacuum analyze`;
	logger.info('finished running vacuum analyze');
};
