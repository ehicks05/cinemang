import type { PersonResponse } from '@ehicks05/tmdb-api';
import pMap from 'p-map';
import { tmdb } from '~/services/tmdb.js';

export const handlePersonChunk = async (ids: number[], type: 'person') => {
	const handleId = async (id: number) => {
		return tmdb.person({ id });
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
