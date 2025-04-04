import type { FileType } from './types.js';

const prod = process.env.NODE_ENV === 'production';
const base = prod ? '/app/storage/' : './script-data/';

export const getPath = (type: FileType) => `${base}${type}.txt`;

export const consoleLogInPlace = (input: string) => {
	process.stdout.clearLine(0);
	process.stdout.cursorTo(0);
	process.stdout.write(input);
};
