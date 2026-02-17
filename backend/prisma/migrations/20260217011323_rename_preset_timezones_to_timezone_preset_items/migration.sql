/*
  Warnings:

  - You are about to drop the `preset_timezones` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "preset_timezones" DROP CONSTRAINT "preset_timezones_preset_id_fkey";

-- DropTable
DROP TABLE "preset_timezones";

-- CreateTable
CREATE TABLE "timezone_preset_items" (
    "id" TEXT NOT NULL,
    "preset_id" TEXT NOT NULL,
    "timezone_identifier" TEXT NOT NULL,
    "display_label" TEXT,
    "position" INTEGER NOT NULL DEFAULT 0,
    "start_time" TEXT,
    "end_time" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "timezone_preset_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "timezone_preset_items" ADD CONSTRAINT "timezone_preset_items_preset_id_fkey" FOREIGN KEY ("preset_id") REFERENCES "timezone_presets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
