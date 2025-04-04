import 'dotenv/config';

import type { MediaResponse } from '~/services/tmdb/types/media.js';
import type { PersonResponse } from '~/services/tmdb/types/person.js';
import { processLineByLine } from './processLineByLine.js';
import { getPath } from './utils.js';

const testReadFromFile = async (type: 'movie' | 'tv' | 'person') => {
	console.time('foo');
	const path = getPath(type);

	processLineByLine(path, (line, i) => {
		const media: MediaResponse | PersonResponse = JSON.parse(line);
		const title = `${'title' in media ? media.title : media.name}`;
		console.log(`${i} ${title}`);
	});

	console.timeEnd('foo');
};

testReadFromFile('movie');
