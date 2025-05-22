import yargs from 'yargs';

const argv = yargs(process.argv.slice(2))
	.options({
		full: { type: 'string', default: 'auto', choices: ['auto', 'off', 'on'] },
		syncOnStart: { type: 'boolean', default: true, alias: 's' },
		runFor: { type: 'string', default: '' }, // examples: movie:1,2,3 or tv:3
	})
	.parseSync();

export { argv };
