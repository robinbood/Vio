-- RLS statements removed by scripts/strip-rls.mjs: Supabase enables RLS with
-- zero policies (deny-all) and drizzle does not model it. Do not re-add them.

ALTER TABLE "action" DROP CONSTRAINT "action_member_creator_id_user_id_fk";
--> statement-breakpoint
DROP INDEX "action_board_created_idx";--> statement-breakpoint
DROP INDEX "action_card_idx";--> statement-breakpoint
DROP INDEX "attachment_card_idx";--> statement-breakpoint
DROP INDEX "api_token_token_idx";--> statement-breakpoint
DROP INDEX "card_board_idx";--> statement-breakpoint
DROP INDEX "card_board_short_idx";--> statement-breakpoint
DROP INDEX "card_list_pos_idx";--> statement-breakpoint
DROP INDEX "board_view_board_pos_idx";--> statement-breakpoint
DROP INDEX "automation_board_idx";--> statement-breakpoint
DROP INDEX "board_url_idx";--> statement-breakpoint
DROP INDEX "board_workspace_idx";--> statement-breakpoint
DROP INDEX "automation_run_automation_ran_idx";--> statement-breakpoint
DROP INDEX "checklist_card_pos_idx";--> statement-breakpoint
DROP INDEX "custom_field_board_pos_idx";--> statement-breakpoint
DROP INDEX "custom_field_item_field_card_idx";--> statement-breakpoint
DROP INDEX "notification_user_unread_idx";--> statement-breakpoint
DROP INDEX "reaction_action_user_emoji_idx";--> statement-breakpoint
DROP INDEX "list_board_pos_idx";--> statement-breakpoint
DROP INDEX "label_board_color_idx";--> statement-breakpoint
DROP INDEX "sticker_card_idx";--> statement-breakpoint
DROP INDEX "undo_entry_user_expires_idx";--> statement-breakpoint
DROP INDEX "webhook_board_idx";--> statement-breakpoint
DROP INDEX "workspace_name_idx";--> statement-breakpoint
DROP INDEX "user_username_idx";--> statement-breakpoint
DROP INDEX "saved_search_user_pos_idx";--> statement-breakpoint
DROP INDEX "checkitem_checklist_pos_idx";--> statement-breakpoint
ALTER TABLE "action" ALTER COLUMN "member_creator_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "action" ADD CONSTRAINT "action_member_creator_id_user_id_fk" FOREIGN KEY ("member_creator_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "action_creator_idx" ON "action" USING btree ("member_creator_id");--> statement-breakpoint
CREATE INDEX "session_user_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_expires_idx" ON "session" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "card_member_user_idx" ON "card_member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "card_label_label_idx" ON "card_label" USING btree ("label_id");--> statement-breakpoint
CREATE INDEX "workspace_member_user_idx" ON "workspace_member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "board_member_user_idx" ON "board_member" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "action_board_created_idx" ON "action" USING btree ("board_id","created_at");--> statement-breakpoint
CREATE INDEX "action_card_idx" ON "action" USING btree ("card_id");--> statement-breakpoint
CREATE INDEX "attachment_card_idx" ON "attachment" USING btree ("card_id");--> statement-breakpoint
CREATE UNIQUE INDEX "api_token_token_idx" ON "api_token" USING btree ("token");--> statement-breakpoint
CREATE INDEX "card_board_idx" ON "card" USING btree ("board_id");--> statement-breakpoint
CREATE UNIQUE INDEX "card_board_short_idx" ON "card" USING btree ("board_id","id_short");--> statement-breakpoint
CREATE INDEX "card_list_pos_idx" ON "card" USING btree ("list_id","pos");--> statement-breakpoint
CREATE INDEX "board_view_board_pos_idx" ON "board_view" USING btree ("board_id","pos");--> statement-breakpoint
CREATE INDEX "automation_board_idx" ON "automation" USING btree ("board_id");--> statement-breakpoint
CREATE UNIQUE INDEX "board_url_idx" ON "board" USING btree ("url");--> statement-breakpoint
CREATE INDEX "board_workspace_idx" ON "board" USING btree ("workspace_id");--> statement-breakpoint
CREATE INDEX "automation_run_automation_ran_idx" ON "automation_run" USING btree ("automation_id","ran_at");--> statement-breakpoint
CREATE INDEX "checklist_card_pos_idx" ON "checklist" USING btree ("card_id","pos");--> statement-breakpoint
CREATE INDEX "custom_field_board_pos_idx" ON "custom_field" USING btree ("board_id","pos");--> statement-breakpoint
CREATE UNIQUE INDEX "custom_field_item_field_card_idx" ON "custom_field_item" USING btree ("custom_field_id","card_id");--> statement-breakpoint
CREATE INDEX "notification_user_unread_idx" ON "notification" USING btree ("user_id","unread");--> statement-breakpoint
CREATE UNIQUE INDEX "reaction_action_user_emoji_idx" ON "reaction" USING btree ("action_id","user_id","emoji");--> statement-breakpoint
CREATE INDEX "list_board_pos_idx" ON "list" USING btree ("board_id","pos");--> statement-breakpoint
CREATE INDEX "label_board_color_idx" ON "label" USING btree ("board_id","color");--> statement-breakpoint
CREATE INDEX "sticker_card_idx" ON "sticker" USING btree ("card_id");--> statement-breakpoint
CREATE INDEX "undo_entry_user_expires_idx" ON "undo_entry" USING btree ("user_id","expires_at");--> statement-breakpoint
CREATE INDEX "webhook_board_idx" ON "webhook" USING btree ("board_id");--> statement-breakpoint
CREATE UNIQUE INDEX "workspace_name_idx" ON "workspace" USING btree ("name");--> statement-breakpoint
CREATE UNIQUE INDEX "user_username_idx" ON "user" USING btree ("username");--> statement-breakpoint
CREATE INDEX "saved_search_user_pos_idx" ON "saved_search" USING btree ("user_id","pos");--> statement-breakpoint
CREATE INDEX "checkitem_checklist_pos_idx" ON "check_item" USING btree ("checklist_id","pos");