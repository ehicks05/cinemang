import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const prismaDirect = new PrismaClient({
	datasourceUrl: process.env.DIRECT_DATABASE_URL,
});

export default prisma;
export { prismaDirect };

export const PRISMA_CONCURRENCY = { concurrency: 8 };
