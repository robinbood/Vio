-- Action fan-out can be retried without creating duplicate notifications.
DELETE FROM "notification" a
USING "notification" b
WHERE a."action_id" IS NOT NULL
  AND a."action_id" = b."action_id"
  AND a."user_id" = b."user_id"
  AND a."type" = b."type"
  AND a."id" > b."id";
--> statement-breakpoint
CREATE INDEX "notification_user_created_idx" ON "notification" USING btree ("user_id","created_at","id");--> statement-breakpoint
CREATE UNIQUE INDEX "notification_action_user_type_idx" ON "notification" USING btree ("action_id","user_id","type");--> statement-breakpoint