import { loadEnvConfig } from '@next/env';
import { defineConfig } from 'prisma/config';

// Load .env.local etc. as `next dev` does (development mode, so .env.production* files,
// which may hold production credentials, are never picked up by local migrations).
loadEnvConfig(process.cwd(), process.env.NODE_ENV !== 'production');

// Migrations always use DIRECT_DATABASE_URL (a direct or session connection). There is no
// fallback to DATABASE_URL, which points at the transaction pooler in production.
// Read with process.env (not prisma/config's env()) so `prisma generate` runs without a database.
export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DIRECT_DATABASE_URL,
  },
});
