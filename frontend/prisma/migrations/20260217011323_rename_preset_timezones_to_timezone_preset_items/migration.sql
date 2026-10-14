-- Step 1: Rename table (preserves data)
ALTER TABLE "preset_timezones" RENAME TO "timezone_preset_items";

-- Step 2: Rename foreign key constraint
ALTER TABLE "timezone_preset_items" RENAME CONSTRAINT "preset_timezones_preset_id_fkey" TO "timezone_preset_items_preset_id_fkey";

-- Step 3: Add VARCHAR constraints to users table
ALTER TABLE "users" ALTER COLUMN "supabase_id" TYPE VARCHAR(255);
ALTER TABLE "users" ALTER COLUMN "email" TYPE VARCHAR(255);
ALTER TABLE "users" ALTER COLUMN "display_name" TYPE VARCHAR(100);

-- Step 4: Add VARCHAR constraints to timezone_presets table
ALTER TABLE "timezone_presets" ALTER COLUMN "name" TYPE VARCHAR(100);

-- Step 5: Add VARCHAR constraints to timezone_preset_items table
ALTER TABLE "timezone_preset_items" ALTER COLUMN "timezone_identifier" TYPE VARCHAR(100);
ALTER TABLE "timezone_preset_items" ALTER COLUMN "display_label" TYPE VARCHAR(200);
ALTER TABLE "timezone_preset_items" ALTER COLUMN "start_time" TYPE VARCHAR(5);
ALTER TABLE "timezone_preset_items" ALTER COLUMN "end_time" TYPE VARCHAR(5);

-- Step 6: Add indexes for better query performance
CREATE INDEX IF NOT EXISTS "timezone_presets_user_id_idx" ON "timezone_presets"("user_id");
CREATE INDEX IF NOT EXISTS "timezone_preset_items_preset_id_idx" ON "timezone_preset_items"("preset_id");
