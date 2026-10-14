-- CreateTable
CREATE TABLE "health_checks" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_checks_pkey" PRIMARY KEY ("id")
);

-- Seed row for the keep-alive query
INSERT INTO "health_checks" DEFAULT VALUES;

-- Expose only SELECT on this table to Supabase PostgREST (anon key).
-- The local Docker PostgreSQL has no anon role, so check that it exists first.
ALTER TABLE "health_checks" ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    GRANT SELECT ON "health_checks" TO anon;
    CREATE POLICY "health_checks_anon_select" ON "health_checks"
      FOR SELECT TO anon USING (true);
  END IF;
END
$$;
