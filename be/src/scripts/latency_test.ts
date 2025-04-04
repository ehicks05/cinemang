import { getMovie } from '~/app/tmdb_api.js';
import logger from '~/services/logger.js';
import prisma from '~/services/prisma.js';

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
	const dur = (end - start) / 3;
	logger.info(`test query 'select 1' averaged ${dur} ms`);
};

const reportTmdbLatency = async () => {
	const id = 603;
	// warm
	await getMovie(id);
	await getMovie(id);
	await getMovie(id);
	// measure
	const start = Date.now();
	await getMovie(id);
	await getMovie(id);
	await getMovie(id);
	const end = Date.now();
	const dur = (end - start) / 3;
	logger.info(`test query '/movie/${id}' averaged ${dur} ms`);
};

export const runLatencyReports = async () => {
	await reportDbLatency();
	await reportTmdbLatency();
};
