-- CreateTable
CREATE TABLE "health_checks" (
    "id" SERIAL NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_checks_pkey" PRIMARY KEY ("id")
);

-- keep-alive 用の初期行
INSERT INTO "health_checks" DEFAULT VALUES;

-- Supabase の PostgREST (anon キー) から読み取れるのはこのテーブルの SELECT のみ。
-- ローカル Docker の PostgreSQL には anon ロールがないため存在チェックを挟む。
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
