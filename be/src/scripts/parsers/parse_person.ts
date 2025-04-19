import type { Prisma } from '@prisma/client';
import type { PersonResponse } from '../types.js';

const isValidPerson = (person: PersonResponse) => person.profile_path;

export const parsePerson = (data: PersonResponse) => {
	if (!isValidPerson(data)) {
		return undefined;
	}

	const create: Prisma.PersonCreateInput = {
		id: data.id,
		biography: data.biography,
		birthday: data.birthday ? new Date(data.birthday) : null,
		deathday: data.deathday ? new Date(data.deathday) : null,
		gender: Number(data.gender),
		imdbId: data.imdb_id,
		knownForDepartment: data.known_for_department || '',
		name: data.name,
		placeOfBirth: data.place_of_birth,
		popularity: data.popularity,
		profilePath: data.profile_path as string,
	};
	return create;
};
