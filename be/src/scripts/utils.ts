import { existsSync, mkdirSync } from 'node:fs';
import logger from '~/services/logger.js';
import { checkFullMode } from './checkFullMode.js';
import type { FileType } from './types.js';

const prod = process.env.NODE_ENV === 'production';
const base = prod ? '/app/storage/' : './script-data/';
logger.info(`writing data files to ${base}`);
const isFullMode = checkFullMode();
const mode = isFullMode ? '.full' : '.incremental';

if (!existsSync(base)) {
	mkdirSync(base, { recursive: true })
}

export const getPath = (type: FileType) => `${base}${type}${mode}.txt`;

export const consoleLogInPlace = (input: string) => {
	if (prod || !process.stdout.clearLine) {
		return;
	}
	process.stdout.clearLine(0);
	process.stdout.cursorTo(0);
	process.stdout.write(input);
};
