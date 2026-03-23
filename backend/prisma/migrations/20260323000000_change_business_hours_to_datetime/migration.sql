-- Change business hours from VARCHAR(5) ("HH:mm") to TIMESTAMP(3) (UTC DateTime)
-- Reference date: 2000-01-01
-- Conversion: "09:00" in timezoneIdentifier → UTC timestamp

-- Step 1: Add new DateTime columns
ALTER TABLE "timezone_preset_items" ADD COLUMN "start_time_dt" TIMESTAMP(3);
ALTER TABLE "timezone_preset_items" ADD COLUMN "end_time_dt" TIMESTAMP(3);

-- Step 2: Convert existing string values to UTC DateTime
-- ('2000-01-01 HH:mm:00')::TIMESTAMP AT TIME ZONE tz converts local time to UTC timestamptz
-- Casting to ::TIMESTAMP stores the UTC wall-clock value
UPDATE "timezone_preset_items"
SET "start_time_dt" = (
  ('2000-01-01 ' || start_time || ':00')::TIMESTAMP AT TIME ZONE timezone_identifier
)::TIMESTAMP
WHERE start_time IS NOT NULL;

UPDATE "timezone_preset_items"
SET "end_time_dt" = (
  ('2000-01-01 ' || end_time || ':00')::TIMESTAMP AT TIME ZONE timezone_identifier
)::TIMESTAMP
WHERE end_time IS NOT NULL;

-- Step 3: Drop old VARCHAR columns
ALTER TABLE "timezone_preset_items" DROP COLUMN "start_time";
ALTER TABLE "timezone_preset_items" DROP COLUMN "end_time";

-- Step 4: Rename new columns
ALTER TABLE "timezone_preset_items" RENAME COLUMN "start_time_dt" TO "start_time";
ALTER TABLE "timezone_preset_items" RENAME COLUMN "end_time_dt" TO "end_time";
