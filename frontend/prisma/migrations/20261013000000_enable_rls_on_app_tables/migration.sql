-- These tables are read and written only by the app's API (src/app/api), which
-- connects as the table owner and bypasses RLS. Supabase also exposes the public
-- schema through PostgREST with the public anon key, so without RLS anyone could
-- read users' emails or change other users' presets there. Enable RLS without any
-- policy (deny all for PostgREST roles), as the poll tables already do.
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "timezone_presets" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "timezone_preset_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "_prisma_migrations" ENABLE ROW LEVEL SECURITY;

-- Also drop the table privileges Supabase grants to its API roles by default.
-- The local Docker PostgreSQL has no such roles, so check that they exist first.
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    REVOKE ALL ON "users", "timezone_presets", "timezone_preset_items", "_prisma_migrations",
      "meeting_polls", "poll_options", "poll_votes" FROM anon;
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    REVOKE ALL ON "users", "timezone_presets", "timezone_preset_items", "_prisma_migrations",
      "meeting_polls", "poll_options", "poll_votes" FROM authenticated;
  END IF;
END
$$;
