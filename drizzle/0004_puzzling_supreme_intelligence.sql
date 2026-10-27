ALTER TABLE "notification" ADD COLUMN "dedupe_key" text;--> statement-breakpoint
CREATE UNIQUE INDEX "notification_user_dedupe_key_idx" ON "notification" USING btree ("user_id","dedupe_key");