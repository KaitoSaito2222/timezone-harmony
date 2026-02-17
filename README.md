# Timezone Harmony

A web application to help teams manage schedules and collaboration across different timezones.

## Architecture

### Local Development Environment
- **Database**: Docker PostgreSQL (local development)
- **Authentication**: Supabase Auth (production)
- **Backend**: NestJS + Prisma
- **Frontend**: React + TypeScript + Vite

### Production Environment
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth
- **Backend**: NestJS
- **Frontend**: React

## Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Docker](https://www.docker.com/) & Docker Compose
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

You'll also need a [Supabase](https://supabase.com/) account and project.

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd timezone_harmony
```

### 2. Supabase Project Setup

1. Log in to [Supabase](https://app.supabase.com/)
2. Create a new project (or use an existing one)
3. Get the following credentials from your project settings:
   - Project Settings > API > Project URL
   - Project Settings > API > Project API keys
     - `service_role` key (for backend)
     - `anon` key (for frontend)

### 3. Environment Variables Setup

#### Backend

```bash
# Copy the example file
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your Supabase credentials:

```env
# Database (Local Docker PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/timezone_harmony"

# Supabase (Production - for Auth only in local dev)
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# App
APP_PORT=3000
FRONTEND_URL=http://localhost:5173
```

#### Frontend

```bash
# Copy the example file
cp frontend/.env.example frontend/.env
```

Edit `frontend/.env` with your Supabase credentials:

```env
# Backend API URL (local NestJS server)
VITE_API_URL=http://localhost:3000/api

# Supabase Configuration (Production)
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 4. Start Docker Database

```bash
cd backend
docker-compose up -d
```

Verify the database is running:
```bash
docker-compose ps
```

### 5. Database Migration

```bash
# Run from backend directory
npm install
npx prisma migrate dev
```

### 6. Install Dependencies and Start Development Servers

#### Backend

```bash
cd backend
npm install
npm run start:dev
```

Backend will run at `http://localhost:3000`

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run at `http://localhost:5173`

## Development Commands

### Backend

```bash
# Start development server
npm run start:dev

# Build
npm run build

# Run tests
npm run test

# Run E2E tests
npm run test:e2e

# Open Prisma Studio (Database GUI)
npx prisma studio
```

### Frontend

```bash
# Start development server
npm run dev

# Build
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## Docker Commands

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Connect to PostgreSQL
docker-compose exec postgres psql -U postgres -d timezone_harmony
```

## Troubleshooting

### Database Connection Error

1. Check if Docker containers are running:
   ```bash
   docker-compose ps
   ```

2. Verify DATABASE_URL is correct in `backend/.env`

3. Restart Docker:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

### Supabase Authentication Error

1. Verify environment variables are set correctly
2. Double-check API keys in Supabase dashboard
3. Ensure no extra spaces or newlines in URLs

## Database Migration Guide

### When to Create a Migration

Create a new migration whenever you change the database schema:
- Add/remove/modify models in `backend/prisma/schema.prisma`
- Add/remove fields
- Change field types or constraints
- Add/remove indexes or unique constraints

### Local Development

```bash
cd backend

# 1. Modify schema.prisma
# 2. Create and apply migration
npx prisma migrate dev --name describe_your_changes

# 3. Verify changes
npx prisma studio
```

### Production Deployment (Railway/Render)

**✅ Recommended: Automatic Migration (Already Configured)**

The project is configured to run migrations automatically on deployment:

1. **Make your schema changes** in `backend/prisma/schema.prisma`
2. **Create migration locally**:
   ```bash
   cd backend
   npx prisma migrate dev --name your_change_description
   ```
3. **Commit and push**:
   ```bash
   git add backend/prisma/
   git commit -m "feat: Add migration for [your changes]"
   git push origin main
   ```
4. **Railway/Render automatically**:
   - Builds Docker image
   - Runs `npx prisma migrate deploy` (configured in Dockerfile)
   - Starts application

**Migration happens automatically during deployment** 🎉

### Manual Production Migration (If Needed)

Only use this if automatic migration fails:

```bash
cd backend

# Connect to production database
DATABASE_URL="your-production-db-url" npx prisma migrate deploy

# Verify migration status
DATABASE_URL="your-production-db-url" npx prisma migrate status
```

### Migration Best Practices

#### ✅ DO:
- **Always test migrations locally first** before deploying
- **Commit migration files to Git** - they are the source of truth
- **Use descriptive migration names** (e.g., `add_user_roles`, `add_indexes_to_presets`)
- **Review generated SQL** in `prisma/migrations/` before applying
- **Backup production data** before major schema changes (if in production)

#### ❌ DON'T:
- **Never delete migration files** - this breaks migration history
- **Never edit applied migrations** - create a new migration instead
- **Never run `prisma db push`** in production - use `migrate deploy`
- **Never skip migrations** - apply them in order

### Troubleshooting Migrations

#### Failed Migration in Production

If a migration fails during deployment:

1. **Check deployment logs** for error details
2. **Fix the issue** (usually schema conflicts)
3. **Mark failed migration as rolled back** (if needed):
   ```sql
   -- In Supabase SQL Editor or psql
   UPDATE "_prisma_migrations"
   SET rolled_back_at = NOW()
   WHERE migration_name = 'failed_migration_name';
   ```
4. **Redeploy** or run `prisma migrate deploy` again

#### Reset Development Database

If your local database gets out of sync:

```bash
cd backend

# WARNING: This deletes all local data
docker-compose down -v
docker-compose up -d
npx prisma migrate dev
```

#### Check Migration Status

```bash
# Local
npx prisma migrate status

# Production
DATABASE_URL="production-url" npx prisma migrate status
```

## Production Deployment

For production deployment, use the commented production configuration in `backend/.env.example` and `frontend/.env.example`.

Get Supabase PostgreSQL connection info from Supabase Dashboard > Project Settings > Database > Connection string.

**Note:** Migrations run automatically during deployment via Dockerfile. See [Database Migration Guide](#database-migration-guide) above.

## License
