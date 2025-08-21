import logger from '~/services/logger.js';
import prisma from '~/services/prisma.js';
import { tmdb } from '~/services/tmdb.js';

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
	return dur;
};

const reportTmdbLatency = async () => {
	const id = 603;
	// warm
	await tmdb.movie({ id });
	await tmdb.movie({ id });
	await tmdb.movie({ id });
	// measure
	const start = Date.now();
	await tmdb.movie({ id });
	await tmdb.movie({ id });
	await tmdb.movie({ id });
	const end = Date.now();
	const dur = Math.round((end - start) / 3);
	return dur;
};

export const runLatencyReports = async () => {
	const db = await reportDbLatency();
	const tmdb = await reportTmdbLatency();

	logger.info(`latencies...db: ${db} ms, tmdb: ${tmdb} ms`)
};
