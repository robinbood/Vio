-- RLS statements removed by scripts/strip-rls.mjs: Supabase enables RLS with
-- zero policies (deny-all) and drizzle does not model it. Do not re-add them.
-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."action_type" AS ENUM('createBoard', 'updateBoard', 'closeBoard', 'reopenBoard', 'deleteBoard', 'starBoard', 'unstarBoard', 'moveBoardToWorkspace', 'createList', 'updateList', 'moveList', 'archiveList', 'unarchiveList', 'createCard', 'updateCard', 'moveCard', 'archiveCard', 'unarchiveCard', 'deleteCard', 'copyCard', 'mirrorCard', 'convertChecklistItemToCard', 'copyCommentCard', 'addMemberToCard', 'removeMemberFromCard', 'addLabelToCard', 'removeLabelFromCard', 'addAttachmentToCard', 'deleteAttachmentFromCard', 'addChecklistToCard', 'updateChecklist', 'deleteChecklist', 'createCheckItem', 'updateCheckItem', 'deleteCheckItem', 'completeCheckItem', 'uncompleteCheckItem', 'commentCard', 'updateComment', 'deleteComment', 'addReaction', 'removeReaction', 'createLabel', 'updateLabel', 'deleteLabel', 'createCustomField', 'updateCustomField', 'deleteCustomField', 'setCustomFieldItem', 'enablePowerUp', 'disablePowerUp', 'createAutomation', 'updateAutomation', 'deleteAutomation', 'runAutomation', 'joinBoard', 'leaveBoard', 'addMemberToBoard', 'removeMemberFromBoard', 'makeAdminOfBoard', 'makeNormalOfBoard', 'makeObserverOfBoard');--> statement-breakpoint
CREATE TYPE "public"."attachment_edge_color" AS ENUM('yellow', 'orange', 'red', 'purple', 'blue', 'sky', 'lime', 'green', 'pink', 'black', 'null');--> statement-breakpoint
CREATE TYPE "public"."automation_action_type" AS ENUM('moveCardToList', 'addLabelToCard', 'removeLabelFromCard', 'setDueDate', 'addMemberToCard', 'postComment', 'markDueComplete', 'moveCardToTop', 'moveCardToBottom', 'archiveCard', 'copyCardToList', 'moveCardToBoard', 'addToChecklist', 'removeFromChecklist', 'sendEmail');--> statement-breakpoint
CREATE TYPE "public"."automation_trigger_type" AS ENUM('cardAddedToList', 'cardAddedWithLabel', 'cardDueIn', 'checkItemCompleted', 'cardMovedToList', 'scheduleDate', 'scheduleDayOfWeek', 'buttonClicked');--> statement-breakpoint
CREATE TYPE "public"."board_view_type" AS ENUM('board', 'timeline', 'calendar', 'table', 'dashboard', 'map');--> statement-breakpoint
CREATE TYPE "public"."board_visibility" AS ENUM('private', 'workspace', 'public');--> statement-breakpoint
CREATE TYPE "public"."cover_color" AS ENUM('yellow', 'orange', 'red', 'purple', 'blue', 'sky', 'lime', 'green', 'pink', 'black', 'null');--> statement-breakpoint
CREATE TYPE "public"."custom_field_type" AS ENUM('text', 'number', 'date', 'checkbox', 'list', 'dropdown');--> statement-breakpoint
CREATE TYPE "public"."label_color" AS ENUM('yellow', 'purple', 'orange', 'green', 'blue', 'red', 'lime', 'sky', 'pink', 'black', 'null');--> statement-breakpoint
CREATE TYPE "public"."member_role" AS ENUM('admin', 'normal', 'observer');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('mention', 'watching', 'dueSoon', 'overdue', 'addedToCard', 'addedToBoard', 'invitedToBoard', 'invitedToWorkspace', 'removedFromBoard', 'comment', 'reaction', 'automationFailed');--> statement-breakpoint
CREATE TYPE "public"."plan" AS ENUM('free', 'standard', 'premium', 'enterprise');--> statement-breakpoint
CREATE TYPE "public"."workspace_visibility" AS ENUM('private', 'public');--> statement-breakpoint
CREATE TABLE "action" (
	"id" text PRIMARY KEY NOT NULL,
	"board_id" text NOT NULL,
	"card_id" text,
	"list_id" text,
	"member_creator_id" text NOT NULL,
	"type" "action_type" NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb,
	"reaction_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attachment" (
	"id" text PRIMARY KEY NOT NULL,
	"card_id" text NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"bytes" integer,
	"mime_type" text,
	"is_upload" boolean DEFAULT false NOT NULL,
	"file" text,
	"preview" text,
	"edge_color" "attachment_edge_color",
	"is_cover" boolean DEFAULT false NOT NULL,
	"id_member" text,
	"date" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "api_token" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"token" text NOT NULL,
	"api_key" text NOT NULL,
	"last_used_at" timestamp with time zone,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "api_token_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"issuer" text DEFAULT 'provider-id' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "board_background" (
	"id" text PRIMARY KEY NOT NULL,
	"board_id" text NOT NULL,
	"url" text NOT NULL,
	"brightness" varchar(8) DEFAULT 'light',
	"uploaded_by_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "card" (
	"id" text PRIMARY KEY NOT NULL,
	"board_id" text NOT NULL,
	"list_id" text NOT NULL,
	"id_short" integer NOT NULL,
	"name" text NOT NULL,
	"desc" text DEFAULT '' NOT NULL,
	"desc_data" jsonb,
	"pos" integer NOT NULL,
	"due" timestamp with time zone,
	"due_reminder" integer,
	"start" timestamp with time zone,
	"due_complete" boolean DEFAULT false NOT NULL,
	"is_closed" boolean DEFAULT false NOT NULL,
	"is_template" boolean DEFAULT false NOT NULL,
	"subscribed" boolean DEFAULT false NOT NULL,
	"url" text NOT NULL,
	"source_card_id" text,
	"mirror_source_id" text,
	"cover_color" "cover_color",
	"cover_attachment_id" text,
	"cover_brightness" varchar(8) DEFAULT 'light',
	"cover_size" varchar(16) DEFAULT 'normal',
	"badges" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "board_view" (
	"id" text PRIMARY KEY NOT NULL,
	"board_id" text NOT NULL,
	"name" text NOT NULL,
	"type" "board_view_type" DEFAULT 'board' NOT NULL,
	"pos" integer NOT NULL,
	"settings" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "automation" (
	"id" text PRIMARY KEY NOT NULL,
	"board_id" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"enabled" boolean DEFAULT true NOT NULL,
	"trigger" "automation_trigger_type" NOT NULL,
	"trigger_data" jsonb DEFAULT '{}'::jsonb,
	"actions" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_by_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "board" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"url" varchar(64) NOT NULL,
	"is_closed" boolean DEFAULT false NOT NULL,
	"is_template" boolean DEFAULT false NOT NULL,
	"is_starred" boolean DEFAULT false NOT NULL,
	"visibility" "board_visibility" DEFAULT 'private' NOT NULL,
	"default_lists" boolean DEFAULT true NOT NULL,
	"background_color" varchar(7),
	"background_image" text,
	"background_brightness" varchar(8) DEFAULT 'light',
	"workspace_id" text,
	"owner_id" text NOT NULL,
	"prefs" jsonb DEFAULT '{}'::jsonb,
	"next_card_short_id" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "automation_run" (
	"id" text PRIMARY KEY NOT NULL,
	"automation_id" text NOT NULL,
	"card_id" text,
	"success" boolean DEFAULT true NOT NULL,
	"error" text,
	"ran_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "checklist" (
	"id" text PRIMARY KEY NOT NULL,
	"card_id" text NOT NULL,
	"name" text NOT NULL,
	"pos" integer NOT NULL,
	"due" timestamp with time zone,
	"due_reminder" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "custom_field" (
	"id" text PRIMARY KEY NOT NULL,
	"board_id" text NOT NULL,
	"name" text NOT NULL,
	"type" "custom_field_type" NOT NULL,
	"options" jsonb DEFAULT '[]'::jsonb,
	"pos" integer DEFAULT 65535 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "custom_field_item" (
	"id" text PRIMARY KEY NOT NULL,
	"custom_field_id" text NOT NULL,
	"card_id" text NOT NULL,
	"value" jsonb,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notification" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"type" "notification_type" NOT NULL,
	"data" jsonb DEFAULT '{}'::jsonb,
	"action_id" text,
	"board_id" text,
	"card_id" text,
	"unread" boolean DEFAULT true NOT NULL,
	"date_read" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reaction" (
	"id" text PRIMARY KEY NOT NULL,
	"action_id" text NOT NULL,
	"user_id" text NOT NULL,
	"emoji" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "list" (
	"id" text PRIMARY KEY NOT NULL,
	"board_id" text NOT NULL,
	"name" text NOT NULL,
	"pos" integer NOT NULL,
	"is_closed" boolean DEFAULT false NOT NULL,
	"subscribed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "label" (
	"id" text PRIMARY KEY NOT NULL,
	"board_id" text NOT NULL,
	"name" text,
	"color" "label_color" DEFAULT 'null' NOT NULL,
	"uses" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "sticker" (
	"id" text PRIMARY KEY NOT NULL,
	"card_id" text NOT NULL,
	"image" text NOT NULL,
	"image_url" text,
	"rotate" integer DEFAULT 0 NOT NULL,
	"top" integer DEFAULT 0 NOT NULL,
	"left" integer DEFAULT 0 NOT NULL,
	"z_index" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "undo_entry" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"board_id" text,
	"action" varchar(64) NOT NULL,
	"data" jsonb NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "webhook" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"board_id" text,
	"callback_url" text NOT NULL,
	"description" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "workspace" (
	"id" text PRIMARY KEY NOT NULL,
	"name" varchar(64) NOT NULL,
	"display_name" text,
	"description" text,
	"website" text,
	"logo" text,
	"visibility" "workspace_visibility" DEFAULT 'private' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"username" varchar(39),
	"full_name" text,
	"initials" varchar(5),
	"avatar_color" varchar(7),
	"bio" text,
	"locale" varchar(10) DEFAULT 'en-US',
	"timezone" varchar(64) DEFAULT 'UTC',
	"plan" "plan" DEFAULT 'free' NOT NULL,
	"totp_secret" text,
	"totp_enabled" boolean DEFAULT false NOT NULL,
	"two_factor_enabled" boolean DEFAULT false NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "saved_search" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"board_id" text,
	"name" text NOT NULL,
	"query" text NOT NULL,
	"pos" integer DEFAULT 65535 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "check_item" (
	"id" text PRIMARY KEY NOT NULL,
	"checklist_id" text NOT NULL,
	"name" text NOT NULL,
	"state" varchar(16) DEFAULT 'incomplete' NOT NULL,
	"pos" integer NOT NULL,
	"due" timestamp with time zone,
	"id_member" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "card_member" (
	"card_id" text NOT NULL,
	"user_id" text NOT NULL,
	CONSTRAINT "card_member_card_id_user_id_pk" PRIMARY KEY("card_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "card_label" (
	"card_id" text NOT NULL,
	"label_id" text NOT NULL,
	CONSTRAINT "card_label_card_id_label_id_pk" PRIMARY KEY("card_id","label_id")
);
--> statement-breakpoint
CREATE TABLE "board_star" (
	"user_id" text NOT NULL,
	"board_id" text NOT NULL,
	"pos" integer DEFAULT 65535 NOT NULL,
	CONSTRAINT "board_star_user_id_board_id_pk" PRIMARY KEY("user_id","board_id")
);
--> statement-breakpoint
CREATE TABLE "workspace_member" (
	"workspace_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" "member_role" DEFAULT 'normal' NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "workspace_member_workspace_id_user_id_pk" PRIMARY KEY("workspace_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "board_member" (
	"board_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" "member_role" DEFAULT 'normal' NOT NULL,
	"starred" boolean DEFAULT false NOT NULL,
	"joined_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "board_member_board_id_user_id_pk" PRIMARY KEY("board_id","user_id")
);
--> statement-breakpoint
CREATE TABLE "board_power_up" (
	"board_id" text NOT NULL,
	"power_up_id" varchar(64) NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"settings" jsonb DEFAULT '{}'::jsonb,
	"enabled_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "board_power_up_board_id_power_up_id_pk" PRIMARY KEY("board_id","power_up_id")
);
--> statement-breakpoint
ALTER TABLE "action" ADD CONSTRAINT "action_board_id_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."board"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action" ADD CONSTRAINT "action_card_id_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."card"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action" ADD CONSTRAINT "action_list_id_list_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."list"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "action" ADD CONSTRAINT "action_member_creator_id_user_id_fk" FOREIGN KEY ("member_creator_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_card_id_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."card"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_id_member_user_id_fk" FOREIGN KEY ("id_member") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "api_token" ADD CONSTRAINT "api_token_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board_background" ADD CONSTRAINT "board_background_board_id_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."board"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board_background" ADD CONSTRAINT "board_background_uploaded_by_id_user_id_fk" FOREIGN KEY ("uploaded_by_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card" ADD CONSTRAINT "card_board_id_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."board"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card" ADD CONSTRAINT "card_list_id_list_id_fk" FOREIGN KEY ("list_id") REFERENCES "public"."list"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board_view" ADD CONSTRAINT "board_view_board_id_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."board"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "automation" ADD CONSTRAINT "automation_board_id_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."board"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "automation" ADD CONSTRAINT "automation_created_by_id_user_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board" ADD CONSTRAINT "board_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board" ADD CONSTRAINT "board_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "automation_run" ADD CONSTRAINT "automation_run_automation_id_automation_id_fk" FOREIGN KEY ("automation_id") REFERENCES "public"."automation"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "automation_run" ADD CONSTRAINT "automation_run_card_id_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."card"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checklist" ADD CONSTRAINT "checklist_card_id_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."card"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_field" ADD CONSTRAINT "custom_field_board_id_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."board"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_field_item" ADD CONSTRAINT "custom_field_item_card_id_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."card"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "custom_field_item" ADD CONSTRAINT "custom_field_item_custom_field_id_custom_field_id_fk" FOREIGN KEY ("custom_field_id") REFERENCES "public"."custom_field"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_action_id_action_id_fk" FOREIGN KEY ("action_id") REFERENCES "public"."action"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_board_id_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."board"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_card_id_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."card"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification" ADD CONSTRAINT "notification_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reaction" ADD CONSTRAINT "reaction_action_id_action_id_fk" FOREIGN KEY ("action_id") REFERENCES "public"."action"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reaction" ADD CONSTRAINT "reaction_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "list" ADD CONSTRAINT "list_board_id_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."board"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "label" ADD CONSTRAINT "label_board_id_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."board"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sticker" ADD CONSTRAINT "sticker_card_id_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."card"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "undo_entry" ADD CONSTRAINT "undo_entry_board_id_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."board"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "undo_entry" ADD CONSTRAINT "undo_entry_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook" ADD CONSTRAINT "webhook_board_id_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."board"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "webhook" ADD CONSTRAINT "webhook_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_search" ADD CONSTRAINT "saved_search_board_id_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."board"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_search" ADD CONSTRAINT "saved_search_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "check_item" ADD CONSTRAINT "check_item_checklist_id_checklist_id_fk" FOREIGN KEY ("checklist_id") REFERENCES "public"."checklist"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "check_item" ADD CONSTRAINT "check_item_id_member_user_id_fk" FOREIGN KEY ("id_member") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_member" ADD CONSTRAINT "card_member_card_id_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."card"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_member" ADD CONSTRAINT "card_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_label" ADD CONSTRAINT "card_label_card_id_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."card"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_label" ADD CONSTRAINT "card_label_label_id_label_id_fk" FOREIGN KEY ("label_id") REFERENCES "public"."label"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board_star" ADD CONSTRAINT "board_star_board_id_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."board"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board_star" ADD CONSTRAINT "board_star_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_member" ADD CONSTRAINT "workspace_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "workspace_member" ADD CONSTRAINT "workspace_member_workspace_id_workspace_id_fk" FOREIGN KEY ("workspace_id") REFERENCES "public"."workspace"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board_member" ADD CONSTRAINT "board_member_board_id_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."board"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board_member" ADD CONSTRAINT "board_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board_power_up" ADD CONSTRAINT "board_power_up_board_id_board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."board"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "action_board_created_idx" ON "action" USING btree ("board_id" text_ops,"created_at" text_ops);--> statement-breakpoint
CREATE INDEX "action_card_idx" ON "action" USING btree ("card_id" text_ops);--> statement-breakpoint
CREATE INDEX "attachment_card_idx" ON "attachment" USING btree ("card_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "api_token_token_idx" ON "api_token" USING btree ("token" text_ops);--> statement-breakpoint
CREATE INDEX "card_board_idx" ON "card" USING btree ("board_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "card_board_short_idx" ON "card" USING btree ("board_id" int4_ops,"id_short" int4_ops);--> statement-breakpoint
CREATE INDEX "card_list_pos_idx" ON "card" USING btree ("list_id" int4_ops,"pos" text_ops);--> statement-breakpoint
CREATE INDEX "board_view_board_pos_idx" ON "board_view" USING btree ("board_id" int4_ops,"pos" int4_ops);--> statement-breakpoint
CREATE INDEX "automation_board_idx" ON "automation" USING btree ("board_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "board_url_idx" ON "board" USING btree ("url" text_ops);--> statement-breakpoint
CREATE INDEX "board_workspace_idx" ON "board" USING btree ("workspace_id" text_ops);--> statement-breakpoint
CREATE INDEX "automation_run_automation_ran_idx" ON "automation_run" USING btree ("automation_id" text_ops,"ran_at" text_ops);--> statement-breakpoint
CREATE INDEX "checklist_card_pos_idx" ON "checklist" USING btree ("card_id" int4_ops,"pos" int4_ops);--> statement-breakpoint
CREATE INDEX "custom_field_board_pos_idx" ON "custom_field" USING btree ("board_id" int4_ops,"pos" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "custom_field_item_field_card_idx" ON "custom_field_item" USING btree ("custom_field_id" text_ops,"card_id" text_ops);--> statement-breakpoint
CREATE INDEX "notification_user_unread_idx" ON "notification" USING btree ("user_id" text_ops,"unread" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "reaction_action_user_emoji_idx" ON "reaction" USING btree ("action_id" text_ops,"user_id" text_ops,"emoji" text_ops);--> statement-breakpoint
CREATE INDEX "list_board_pos_idx" ON "list" USING btree ("board_id" int4_ops,"pos" int4_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "label_board_color_idx" ON "label" USING btree ("board_id" text_ops,"color" text_ops);--> statement-breakpoint
CREATE INDEX "sticker_card_idx" ON "sticker" USING btree ("card_id" text_ops);--> statement-breakpoint
CREATE INDEX "undo_entry_user_expires_idx" ON "undo_entry" USING btree ("user_id" text_ops,"expires_at" text_ops);--> statement-breakpoint
CREATE INDEX "webhook_board_idx" ON "webhook" USING btree ("board_id" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "workspace_name_idx" ON "workspace" USING btree ("name" text_ops);--> statement-breakpoint
CREATE UNIQUE INDEX "user_username_idx" ON "user" USING btree ("username" text_ops);--> statement-breakpoint
CREATE INDEX "saved_search_user_pos_idx" ON "saved_search" USING btree ("user_id" int4_ops,"pos" int4_ops);--> statement-breakpoint
CREATE INDEX "checkitem_checklist_pos_idx" ON "check_item" USING btree ("checklist_id" int4_ops,"pos" int4_ops);
*/