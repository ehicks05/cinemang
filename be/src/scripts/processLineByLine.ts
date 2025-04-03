import fs from 'node:fs';
import readline from 'node:readline';

export async function processLineByLine(
	path: string,
	handleLine: (line: string, i: number) => void,
) {
	const fileStream = fs.createReadStream(path);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Number.POSITIVE_INFINITY,
	});
	// Note: we use the crlfDelay option to recognize all instances of CR LF
	// ('\r\n') in input.txt as a single line break.

	let i = 0;
	for await (const line of rl) {
		// Each line in input.txt will be successively available here as `line`.
		handleLine(line, i);
		i++;
	}
}

export async function processLines(
	path: string,
	handleChunk: (lines: string[], chunkIndex: number) => Promise<void>,
	chunkSize = 500,
) {
	const fileStream = fs.createReadStream(path);

	const rl = readline.createInterface({
		input: fileStream,
		crlfDelay: Number.POSITIVE_INFINITY,
	});
	// Note: we use the crlfDelay option to recognize all instances of CR LF
	// ('\r\n') in input.txt as a single line break.

	let chunkIndex = 0;
	let chunk: string[] = [];
	for await (const line of rl) {
		// Each line in input.txt will be successively available here as `line`.
		chunk.push(line);

		if (chunk.length === chunkSize) {
			await handleChunk(chunk, chunkIndex);
			chunk = [];
			chunkIndex++;
		}
	}

	if (chunk.length !== 0) {
		await handleChunk(chunk, chunkIndex);
	}
}
