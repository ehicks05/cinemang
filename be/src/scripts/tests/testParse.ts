import { tmdb } from '~/services/tmdb/index.js';
import { PersonResponseSchema } from '~/services/tmdb/types/person.js';
import { SeasonResponseSchema } from '~/services/tmdb/types/season.js';
import { ValidMovieSchema, ValidShowSchema } from '../parsers/validation.js';

const testGetMovie = async () => {
	const id = 46026;
	const res = await tmdb.getMovie(id);

	if (!res) {
		console.log(`❌ movie ${id}`);
		return;
	}

	const { data, error } = ValidMovieSchema.safeParse(res);

	if (data) {
		console.log(`✔️ ${data.title}`);
	}
	if (error) {
		console.log(error.issues);
	}
};

const testGetShow = async () => {
	const res = await tmdb.getShow(95396);
	const { data, error } = ValidShowSchema.safeParse(res);

	if (data) {
		console.log(`✔️ ${data.name}`);
	}
	if (error) {
		console.log(error.message);
	}
};

const testGetSeason = async () => {
	const res = await tmdb.getSeason(95396, 1);
	const { data, error } = SeasonResponseSchema.safeParse(res);

	if (data) {
		console.log(`✔️ ${data.name}`);
	}
	if (error) {
		console.log(error.message);
	}
};

const testGetPerson = async () => {
	const res = await tmdb.getPerson(973497);
	const { data, error } = PersonResponseSchema.safeParse(res);

	if (data) {
		console.log(`✔️ ${data.name}`);
	}
	if (error) {
		console.log(error.message);
	}
};

await testGetMovie();
await testGetShow();
await testGetSeason();
await testGetPerson();
