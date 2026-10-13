import { loadEnvConfig } from '@next/env';
import { defineConfig } from 'prisma/config';

// Load .env.local etc. the same way Next.js does, so the Prisma CLI sees the same DATABASE_URL.
loadEnvConfig(process.cwd());

// Migrations need a direct (session) connection; the app itself uses DATABASE_URL,
// which points at the transaction pooler in production.
// Read with process.env (not prisma/config's env()) so `prisma generate` runs without a database.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DIRECT_DATABASE_URL || process.env.DATABASE_URL,
  },
});
