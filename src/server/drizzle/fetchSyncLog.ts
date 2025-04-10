import { createServerFn } from '@tanstack/react-start';
import { db } from './db/drizzle';

export type SyncLog = NonNullable<Awaited<ReturnType<typeof fetchSyncLog>>>;

export const fetchSyncLog = createServerFn().handler(async () => {
	return db.query.syncRunLog.findFirst({
		orderBy: { createdAt: 'desc' },
	});
});
