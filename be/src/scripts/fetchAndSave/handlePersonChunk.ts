import pMap from 'p-map';
import { tmdb } from '~/services/tmdb/index.js';
import type { PersonResponse } from '~/services/tmdb/types/person.js';

export const handlePersonChunk = async (ids: number[], type: 'person') => {
	const handleId = async (id: number) => {
		return tmdb.getPerson(id);
	};

	const trim = (p: PersonResponse) => ({
		...p,
		credits: undefined,
	});

	const _persons = await pMap(ids, handleId);
	const persons = _persons
		.filter((person): person is PersonResponse => person !== undefined)
		.map(trim)
		.map((person) => JSON.stringify(person));
	return persons;
};
