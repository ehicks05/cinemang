import logger from '~/services/logger.js';
import prisma from '~/services/prisma.js';
import { tmdb } from '../services/tmdb/index.js';

export const updateGenres = async () => {
	const genres = await tmdb.getGenres();

	await prisma.genre.deleteMany();
	await prisma.genre.createMany({ data: genres });
};

export const updateLanguages = async () => {
	const _languages = await tmdb.getLanguages();
	const languages = _languages.map((o) => ({
		id: o.iso_639_1,
		name: o.english_name,
	}));

	await prisma.language.deleteMany();
	await prisma.language.createMany({ data: languages });
};

export const updateProviders = async () => {
	const _providers = await tmdb.getProviders();
	const providers = _providers.map((o) => ({
		displayPriority: o.display_priorities.US,
		id: o.provider_id,
		logoPath: o.logo_path,
		name: o.provider_name,
	}));

	await prisma.provider.deleteMany();
	await prisma.provider.createMany({ data: providers });
};

export const droploadSystemTables = async () => {
	logger.info('droploading system tables');

	await Promise.all([updateGenres(), updateLanguages(), updateProviders()]);

	logger.info('finished droploading system tables');
};
