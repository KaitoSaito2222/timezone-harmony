import 'server-only';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

// One client per server instance. In development, hot reloads would otherwise
// create a new client (and connection pool) on every change.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // A function instance serves one request at a time, so a small pool is enough. Fail fast
    // instead of hanging until the platform kills the function when the database is unreachable.
    adapter: new PrismaPg({
      connectionString: process.env.DATABASE_URL,
      max: 2,
      connectionTimeoutMillis: 5000,
      idleTimeoutMillis: 10000,
    }),
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
