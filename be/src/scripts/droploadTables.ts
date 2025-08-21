import type { Prisma } from '~/generated/prisma/client.js';
import logger from '~/services/logger.js';
import prisma from '~/services/prisma.js';
import { parseMovie } from './parsers/parse_movie.js';
import { parsePerson } from './parsers/parse_person.js';
import { parseShow } from './parsers/parse_show.js';
import { processLines } from './processLineByLine.js';
import { getPath } from './utils.js';

export const dropLoadTable = async (type: 'movie' | 'tv' | 'person') => {
	logger.info(`droploading ${type}`);

	await processLines(
		getPath(type),
		async (chunk) => {
			const inserts = chunk
				.map((line) => {
					const json = JSON.parse(line);
					if (type === 'movie') return parseMovie(json);
					if (type === 'tv') return parseShow(json);
					if (type === 'person') return parsePerson(json);
				})
				.filter((o) => !!o);

			if (type === 'movie') {
				const data = inserts as unknown as Prisma.MovieCreateInput[];
				const ids = data.map((o) => o.id);
				await prisma.movie.deleteMany({ where: { id: { in: ids } } });
				await prisma.movie.createMany({ data });
			}
			if (type === 'tv') {
				const data = inserts as unknown as Prisma.ShowCreateInput[];
				const ids = data.map((o) => o.id);
				await prisma.show.deleteMany({ where: { id: { in: ids } } });
				await prisma.show.createMany({ data });
			}
			if (type === 'person') {
				const data = inserts as unknown as Prisma.PersonCreateInput[];
				const ids = data.map((o) => o.id);
				await prisma.person.deleteMany({ where: { id: { in: ids } } });
				await prisma.person.createMany({ data });
			}
		},
		500,
	);

	logger.info(`finished droploading ${type}`);
};
