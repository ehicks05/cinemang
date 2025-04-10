import { drizzle } from 'drizzle-orm/node-postgres';
import { relations } from '~/server/drizzle/db/relations';

export const db = drizzle(process.env.DATABASE_URL || '', { relations });
