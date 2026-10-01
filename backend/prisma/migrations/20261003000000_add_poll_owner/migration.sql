-- AlterTable
ALTER TABLE "meeting_polls" ADD COLUMN "user_id" TEXT;

-- CreateIndex
CREATE INDEX "meeting_polls_user_id_idx" ON "meeting_polls"("user_id");

-- AddForeignKey
ALTER TABLE "meeting_polls" ADD CONSTRAINT "meeting_polls_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
