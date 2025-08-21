import { PrismaClient } from '../generated/prisma/client.js';

const prisma = new PrismaClient();
const prismaDirect = new PrismaClient({
	datasourceUrl: process.env.DIRECT_DATABASE_URL,
});

export default prisma;
export { prismaDirect };

export const PRISMA_CONCURRENCY = { concurrency: 8 };
