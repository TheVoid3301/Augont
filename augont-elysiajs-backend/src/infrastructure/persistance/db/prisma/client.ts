import { PrismaClient } from './generated';
import { env } from '../../../config/env';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

declare global {
  var prismaClient: PrismaClient | undefined;
}

const pool = new Pool({
  connectionString: env.DATABASE_URL
});

const adapter = new PrismaPg(pool);

const prisma =
  globalThis.prismaClient ??
  new PrismaClient({
    adapter: adapter,
    log: ['query', 'info', 'warn', 'error']
  });

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaClient = prisma;
}

export { prisma };
