import logger from '~/services/logger.js';
import prisma from '~/services/prisma.js';
import tmdb from '~/services/tmdb/tmdb.js';

export const reportDbLatency = async () => {
	// warm
	await prisma.$executeRaw`select 1`;
	await prisma.$executeRaw`select 1`;
	await prisma.$executeRaw`select 1`;
	// measure
	const start = Date.now();
	await prisma.$executeRaw`select 1`;
	await prisma.$executeRaw`select 1`;
	await prisma.$executeRaw`select 1`;
	const end = Date.now();
	const dur = (end - start) / 3;
	logger.info(`test query 'select 1' averaged ${dur} ms`);
};

export const reportTmdbLatency = async () => {
	// warm
	await tmdb.get('/movie/2');
	await tmdb.get('/movie/2');
	await tmdb.get('/movie/2');
	// measure
	const start = Date.now();
	await tmdb.get('/movie/2');
	await tmdb.get('/movie/2');
	await tmdb.get('/movie/2');
	const end = Date.now();
	const dur = (end - start) / 3;
	logger.info(`test query '/movie/2' averaged ${dur} ms`);
};
