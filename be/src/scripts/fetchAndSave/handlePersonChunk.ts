import { appendFile } from 'node:fs/promises';
import pMap from 'p-map';
import { TMDB_OPTIONS } from '../../services/tmdb/constants.js';
import { getPerson } from '../../services/tmdb/simple_endpoints.js';
import type { PersonResponse } from '../../services/tmdb/types/responses.js';
import { getPath } from '../utils.js';

export const handlePersonChunk = async (
	ids: number[],
	i: number,
	type: 'movie' | 'tv' | 'person',
) => {
	const path = getPath(type);
	const handleId = async (id: number) => {
		return getPerson(id);
	};

	const trim = (p: PersonResponse) => ({
		...p,
		credits: undefined,
	});

	const _person = await pMap(ids, handleId, TMDB_OPTIONS);
	const media = _person
		.filter((person): person is PersonResponse => person !== undefined)
		.map(trim)
		.map((person) => JSON.stringify(person));

	if (media.length > 0) {
		if (i !== 0) {
			await appendFile(path, '\n');
		}
		await appendFile(path, media.join('\n'));
	}
};
