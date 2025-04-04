import { appendFile } from 'node:fs/promises';
import pMap from 'p-map';
import { TMDB_OPTIONS } from '../../services/tmdb/constants.js';
import { tmdb } from '../../services/tmdb/index.js';
import type { PersonResponse } from '../../services/tmdb/types/responses.js';
import { getPath } from '../utils.js';

export const handlePersonChunk = async (
	ids: number[],
	i: number,
	type: 'person',
) => {
	const path = getPath(type);
	const handleId = async (id: number) => {
		return tmdb.getPerson(id);
	};

	const trim = (p: PersonResponse) => ({
		...p,
		credits: undefined,
	});

	const _persons = await pMap(ids, handleId, TMDB_OPTIONS);
	const persons = _persons
		.filter((person): person is PersonResponse => person !== undefined)
		.map(trim)
		.map((person) => JSON.stringify(person));

	if (persons.length > 0) {
		if (i !== 0) {
			await appendFile(path, '\n');
		}
		await appendFile(path, persons.join('\n'));
	}
};
