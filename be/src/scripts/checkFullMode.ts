import { argv } from '~/services/args.js';
import logger from '~/services/logger.js';

export const checkFullMode = () => {
	if (argv.full) {
		logger.info('--full arg detected.');
	}

	const isStartOfMonth = new Date().getDate() === 1;
	if (isStartOfMonth) {
		logger.info('start of month detected.');
	}

	const fullMode = argv.full || isStartOfMonth;
	return fullMode;
};
