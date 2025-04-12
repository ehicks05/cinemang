import { createServerFn } from '@tanstack/react-start';
import { db } from './db/drizzle';

type _ReturnType = Awaited<ReturnType<typeof fetchSystemData>>;
export type Genre = _ReturnType['genres'][number];
export type Language = _ReturnType['languages'][number];
export type Provider = _ReturnType['providers'][number];
export type SyncLog = _ReturnType['syncLog'];

export const fetchSystemData = createServerFn().handler(async () => {
	const [genres, languages, providers, syncLog] = await Promise.all([
		db.query.genre.findMany(),
		db.query.language.findMany(),
		db.query.provider.findMany(),
		db.query.syncRunLog.findFirst({ orderBy: { createdAt: 'desc' } }),
	]);

	return { genres, languages, providers, syncLog };
});
