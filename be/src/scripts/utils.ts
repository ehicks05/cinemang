export const getPath = (type: 'movie' | 'tv' | 'person') =>
	`./scripts-data/${type}.txt`;

export const consoleLogInPlace = (input: string) => {
	process.stdout.clearLine(0);
	process.stdout.cursorTo(0);
	process.stdout.write(input);
};
