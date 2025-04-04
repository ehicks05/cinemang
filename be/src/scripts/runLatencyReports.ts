import logger from '~/services/logger.js';
import prisma from '~/services/prisma.js';
import { tmdb } from '~/services/tmdb/index.js';

const reportDbLatency = async () => {
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
	const dur = Math.round((end - start) / 3);
	logger.info(`test query 'select 1' averaged ${dur} ms`);
};

const reportTmdbLatency = async () => {
	const id = 603;
	// warm
	await tmdb.getMovie(id);
	await tmdb.getMovie(id);
	await tmdb.getMovie(id);
	// measure
	const start = Date.now();
	await tmdb.getMovie(id);
	await tmdb.getMovie(id);
	await tmdb.getMovie(id);
	const end = Date.now();
	const dur = Math.round((end - start) / 3);
	logger.info(`test query '/movie/${id}' averaged ${dur} ms`);
};

export const runLatencyReports = async () => {
	await reportDbLatency();
	await reportTmdbLatency();
};
