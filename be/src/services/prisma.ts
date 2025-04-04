import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default prisma;

export const PRISMA_CONCURRENCY = { concurrency: 8 };
