import yargs from 'yargs';

const argv = yargs(process.argv.slice(2))
	.options({
		full: { type: 'boolean', default: false },
		syncOnStart: { type: 'boolean', default: true },
		runFor: { type: 'string', default: '' }, // examples: movie:1,2,3 or tv:3
	})
	.parseSync();

export { argv };
