import { createServerFn } from '@tanstack/react-start';
import prisma from './prisma';

export type SyncLog = NonNullable<Awaited<ReturnType<typeof fetchSyncLog>>>;

export const fetchSyncLog = createServerFn().handler(async () => {
	const log = await prisma.syncRunLog.findFirst({
		orderBy: { createdAt: 'desc' },
	});

	return log;
});
