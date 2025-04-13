import { db } from './db/drizzle';

export type FetchSystemDataReturn = Awaited<ReturnType<typeof fetchSystemDataQuery>>;
export type Genre = FetchSystemDataReturn['genres'][number];
export type Language = FetchSystemDataReturn['languages'][number];
export type Provider = FetchSystemDataReturn['providers'][number];
export type SyncLog = FetchSystemDataReturn['syncLog'][number];

export const fetchSystemDataQuery = async () => {
	const [genres, languages, providers, syncLog] = await Promise.all([
		db.query.genre.findMany(),
		db.query.language.findMany(),
		db.query.provider.findMany(),
		db.query.syncRunLog.findMany({ orderBy: { createdAt: 'desc' }, limit: 1 }),
	]);

	return { genres, languages, providers, syncLog };
};
