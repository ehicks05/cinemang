import { argv } from '~/services/args.js';
import logger from '~/services/logger.js';

export const checkFullMode = () => {
	if (argv.full !== 'auto') {
		logger.info('--full arg detected.');
	}

	const isStartOfMonth = new Date().getDate() === 1;
	if (isStartOfMonth) {
		logger.info('start of month detected.');
	}

	const fullMode = argv.full === 'on' || (isStartOfMonth && argv.full !== 'off');
	logger.info(`running ${fullMode ? 'full' : 'partial'} load`);

	return fullMode;
};
