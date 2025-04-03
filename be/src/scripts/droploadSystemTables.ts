import logger from '~/services/logger.js';
import prisma from '~/services/prisma.js';
import {
	getGenres,
	getLanguages,
	getProviders,
} from '~/services/tmdb/simple_endpoints.js';

export const updateGenres = async () => {
	await prisma.genre.deleteMany({});

	const genres = await getGenres();

	await prisma.genre.createMany({ data: genres });
};

export const updateLanguages = async () => {
	await prisma.language.deleteMany({});

	const _languages = await getLanguages();
	const languages = _languages.map((o) => ({
		id: o.iso_639_1,
		name: o.english_name,
	}));

	await prisma.language.createMany({ data: languages });
};

export const updateProviders = async () => {
	await prisma.provider.deleteMany({});

	const _providers = await getProviders();
	const providers = _providers.map((o) => ({
		displayPriority: o.display_priorities.US,
		id: o.provider_id,
		logoPath: o.logo_path,
		name: o.provider_name,
	}));

	await prisma.provider.createMany({ data: providers });
};

export const droploadSystemTables = async () => {
	logger.info('droploading system tables');
	await updateGenres();
	await updateLanguages();
	await updateProviders();
	logger.info('finished droploading system tables');
};
