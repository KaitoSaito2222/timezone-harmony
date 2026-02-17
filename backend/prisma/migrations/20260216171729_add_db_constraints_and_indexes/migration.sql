-- AlterTable: Add length constraints to users table
ALTER TABLE "users" ALTER COLUMN "supabase_id" TYPE VARCHAR(255);
ALTER TABLE "users" ALTER COLUMN "email" TYPE VARCHAR(255);
ALTER TABLE "users" ALTER COLUMN "display_name" TYPE VARCHAR(100);

-- AlterTable: Add length constraints to timezone_presets table
ALTER TABLE "timezone_presets" ALTER COLUMN "name" TYPE VARCHAR(100);

-- AlterTable: Add length constraints to timezone_preset_items table
ALTER TABLE "timezone_preset_items" ALTER COLUMN "timezone_identifier" TYPE VARCHAR(100);
ALTER TABLE "timezone_preset_items" ALTER COLUMN "display_label" TYPE VARCHAR(200);
ALTER TABLE "timezone_preset_items" ALTER COLUMN "start_time" TYPE VARCHAR(5);
ALTER TABLE "timezone_preset_items" ALTER COLUMN "end_time" TYPE VARCHAR(5);

-- CreateIndex: Add index on timezone_presets.user_id for better query performance
CREATE INDEX "timezone_presets_user_id_idx" ON "timezone_presets"("user_id");

-- CreateIndex: Add index on timezone_preset_items.preset_id for better query performance
CREATE INDEX "timezone_preset_items_preset_id_idx" ON "timezone_preset_items"("preset_id");
