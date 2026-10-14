# Timezone Harmony

A web application to help teams manage schedules and collaboration across different timezones.

## Architecture

Everything runs as a single Next.js app on Netlify; there is no separate backend server.

- **Frontend**: Next.js + TypeScript + Tailwind CSS (Netlify)
- **API**: Next.js route handlers in `frontend/src/app/api`, deployed as Netlify Functions
- **Database**: Supabase PostgreSQL in production, Docker PostgreSQL locally (Prisma)
- **Authentication**: Supabase Auth. The API verifies Supabase access tokens against the project's JWKS.

Data that never changes between requests is not served by the API:

- **Timezone list**: localized city/country names and kana readings are generated into
  `frontend/src/data/timezones.json` by `npm run generate:timezones`. UTC offsets are computed in the
  browser so DST changes are reflected.
- **Calendar export (.ics)**: generated in the browser.

### API routes

| Route | Auth |
|---|---|
| `GET /api/users/me` | required |
| `GET, POST /api/presets`, `GET, PUT, DELETE /api/presets/:id`, `POST /api/presets/:id/favorite` | required |
| `POST /api/polls` | optional (records the owner when signed in) |
| `GET /api/polls/:id`, `POST /api/polls/:id/votes` | none (the poll id is the link secret) |
| `GET /api/polls/mine`, `POST /api/polls/claim` | required |

## Prerequisites

- [Node.js](https://nodejs.org/) 22
- [Docker](https://www.docker.com/) & Docker Compose (for the local database)
- A [Supabase](https://supabase.com/) project (for Auth)

## Local Development Setup

All commands run from `frontend/`.

### 1. Environment variables

```bash
cd frontend
cp .env.example .env.local
```

Fill in `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from
Supabase Dashboard > Project Settings > API. The default `DATABASE_URL` / `DIRECT_DATABASE_URL`
point at the local Docker database. The Prisma CLI reads the same `.env.local` (see `prisma.config.ts`);
migrations use `DIRECT_DATABASE_URL`.

### 2. Start the database and apply migrations

```bash
docker compose up -d
npm install            # also runs `prisma generate`
npm run db:migrate
```

### 3. Start the app

```bash
npm run dev
```

The app runs at `http://localhost:3001`, and the API at `http://localhost:3001/api`.

## Commands

```bash
npm run dev                  # development server
npm run build                # production build
npm run start                # serve the production build
npm run generate:timezones   # regenerate src/data/timezones.json (commit the result)
npm run db:migrate           # create/apply migrations locally (prisma migrate dev)
npm run db:migrate:deploy    # apply migrations to the database in DIRECT_DATABASE_URL
npm run db:studio            # Prisma Studio
```

Pull requests that touch `frontend/` run `.github/workflows/ci.yml` (typecheck and production build).

## Production (Netlify)

The Netlify site's **base directory** must be `frontend` (that is where `netlify.toml` lives).
Builds are skipped when a commit changes nothing under `frontend/`.

Set these environment variables on the Netlify site:

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `NEXT_PUBLIC_SITE_URL` | Public site URL |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics ID (optional) |
| `DATABASE_URL` | Supabase **transaction pooler** connection string (port 6543) |

Use the transaction pooler for `DATABASE_URL`: every function instance opens its own
connection, and a direct connection would exhaust the database's connection limit.
Get it from Supabase Dashboard > Connect > Connection string.

- `NEXT_PUBLIC_*` values are inlined at build time. After changing one, trigger a new deploy.
- Scope `DATABASE_URL` to the **Production** deploy context only. Deploy previews run the same API,
  so a site-wide value would let every preview read and write the production database. (Previews then
  serve pages normally, but their API calls fail.)

### Release checklist

1. Environment variables above are set (and `DATABASE_URL` is production-only).
2. Pending migrations are applied to production (see below).
3. Merge, then check the deploy: sign in, open the presets page, create and vote on a poll.

### Rollback

Use Netlify's "Publish deploy" on the previous production deploy. If a migration was applied,
check that the previous code still works with the new schema before rolling back.

## Database Migrations

Migrations are **not** run during the Netlify build (deploy previews would otherwise migrate the
production database). Apply them yourself before deploying code that depends on them: run the
**Apply database migrations** workflow (Actions tab > Run workflow, needs the `DIRECT_DATABASE_URL`
repository secret), or run the command below from your machine.

### Creating a migration

```bash
cd frontend
# 1. Edit prisma/schema.prisma
# 2. Create and apply the migration locally
npx prisma migrate dev --name describe_your_changes
# 3. Commit prisma/migrations
```

### Applying migrations to production from your machine

`DIRECT_DATABASE_URL` must be the session pooler or direct connection (port 5432); the transaction
pooler cannot run migrations.

```bash
cd frontend
DIRECT_DATABASE_URL="your-production-db-url" npm run db:migrate:deploy

# Verify
DIRECT_DATABASE_URL="your-production-db-url" npx prisma migrate status
```

### Best practices

- Test migrations locally first and review the generated SQL in `prisma/migrations/`.
- Commit migration files; never edit or delete an applied migration (create a new one instead).
- Never run `prisma db push` against production.

### Recovering from a failed migration

```sql
-- In the Supabase SQL Editor
UPDATE "_prisma_migrations"
SET rolled_back_at = NOW()
WHERE migration_name = 'failed_migration_name';
```

Then fix the issue and run `npm run db:migrate:deploy` again.

### Resetting the local database

```bash
cd frontend
# WARNING: deletes all local data
docker compose down -v
docker compose up -d
npm run db:migrate
```

## Supabase keep-alive

The Supabase Free plan pauses projects after a week of inactivity.
`.github/workflows/supabase-keepalive.yml` queries the `health_checks` table twice a week to prevent
that. It needs the `SUPABASE_URL` and `SUPABASE_ANON_KEY` repository secrets.

## Troubleshooting

- **API returns 500**: check that `DATABASE_URL` is set and reachable, and that migrations are applied.
- **Every API call returns 401**: check that `NEXT_PUBLIC_SUPABASE_URL` points at the same project that
  issued the session.
- **Database connection errors locally**: `docker compose ps`, then `docker compose down && docker compose up -d`.

## License
