import {
  pgTable,
  text,
  timestamp,
  boolean,
  integer,
  jsonb,
  primaryKey,
  uniqueIndex,
  index,
  pgEnum,
  varchar,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const boardVisibilityEnum = pgEnum("board_visibility", [
  "private",
  "workspace",
  "public",
]);
export const boardViewTypeEnum = pgEnum("board_view_type", [
  "board",
  "timeline",
  "calendar",
  "table",
  "dashboard",
  "map",
]);
export const workspaceVisibilityEnum = pgEnum("workspace_visibility", [
  "private",
  "public",
]);
export const memberRoleEnum = pgEnum("member_role", [
  "admin",
  "normal",
  "observer",
]);
export const planEnum = pgEnum("plan", [
  "free",
  "standard",
  "premium",
  "enterprise",
]);
export const labelColorEnum = pgEnum("label_color", [
  "yellow",
  "purple",
  "orange",
  "green",
  "blue",
  "red",
  "lime",
  "sky",
  "pink",
  "black",
  "null",
]);
export const actionTypeEnum = pgEnum("action_type", [
  "createBoard",
  "updateBoard",
  "closeBoard",
  "reopenBoard",
  "deleteBoard",
  "starBoard",
  "unstarBoard",
  "moveBoardToWorkspace",
  "createList",
  "updateList",
  "moveList",
  "archiveList",
  "unarchiveList",
  "createCard",
  "updateCard",
  "moveCard",
  "archiveCard",
  "unarchiveCard",
  "deleteCard",
  "copyCard",
  "mirrorCard",
  "convertChecklistItemToCard",
  "copyCommentCard",
  "addMemberToCard",
  "removeMemberFromCard",
  "addLabelToCard",
  "removeLabelFromCard",
  "addAttachmentToCard",
  "deleteAttachmentFromCard",
  "addChecklistToCard",
  "updateChecklist",
  "deleteChecklist",
  "createCheckItem",
  "updateCheckItem",
  "deleteCheckItem",
  "completeCheckItem",
  "uncompleteCheckItem",
  "commentCard",
  "updateComment",
  "deleteComment",
  "addReaction",
  "removeReaction",
  "createLabel",
  "updateLabel",
  "deleteLabel",
  "createCustomField",
  "updateCustomField",
  "deleteCustomField",
  "setCustomFieldItem",
  "enablePowerUp",
  "disablePowerUp",
  "createAutomation",
  "updateAutomation",
  "deleteAutomation",
  "runAutomation",
  "joinBoard",
  "leaveBoard",
  "addMemberToBoard",
  "removeMemberFromBoard",
  "makeAdminOfBoard",
  "makeNormalOfBoard",
  "makeObserverOfBoard",
]);
export const notificationTypeEnum = pgEnum("notification_type", [
  "mention",
  "watching",
  "dueSoon",
  "overdue",
  "addedToCard",
  "addedToBoard",
  "invitedToBoard",
  "invitedToWorkspace",
  "removedFromBoard",
  "comment",
  "reaction",
  "automationFailed",
]);
export const attachmentEdgeColorEnum = pgEnum("attachment_edge_color", [
  "yellow",
  "orange",
  "red",
  "purple",
  "blue",
  "sky",
  "lime",
  "green",
  "pink",
  "black",
  "null",
]);
export const customFieldTypeEnum = pgEnum("custom_field_type", [
  "text",
  "number",
  "date",
  "checkbox",
  "list",
  "dropdown",
]);
export const coverColorEnum = pgEnum("cover_color", [
  "yellow",
  "orange",
  "red",
  "purple",
  "blue",
  "sky",
  "lime",
  "green",
  "pink",
  "black",
  "null",
]);
export const automationTriggerTypeEnum = pgEnum("automation_trigger_type", [
  "cardAddedToList",
  "cardAddedWithLabel",
  "cardDueIn",
  "checkItemCompleted",
  "cardMovedToList",
  "scheduleDate",
  "scheduleDayOfWeek",
  "buttonClicked",
]);
export const automationActionTypeEnum = pgEnum("automation_action_type", [
  "moveCardToList",
  "addLabelToCard",
  "removeLabelFromCard",
  "setDueDate",
  "addMemberToCard",
  "postComment",
  "markDueComplete",
  "moveCardToTop",
  "moveCardToBottom",
  "archiveCard",
  "copyCardToList",
  "moveCardToBoard",
  "addToChecklist",
  "removeFromChecklist",
  "sendEmail",
]);

// Better-auth tables (consumed by drizzle-adapter)
export const user = pgTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),

    // Vio extensions to the better-auth user table
    username: varchar("username", { length: 39 }).unique(),
    fullName: text("full_name"),
    initials: varchar("initials", { length: 5 }),
    avatarColor: varchar("avatar_color", { length: 7 }),
    bio: text("bio"),
    locale: varchar("locale", { length: 10 }).default("en-US"),
    timezone: varchar("timezone", { length: 64 }).default("UTC"),
    plan: planEnum("plan").notNull().default("free"),
    totpSecret: text("totp_secret"),
    totpEnabled: boolean("totp_enabled").notNull().default(false),
  },
  (t) => ({
    usernameIdx: uniqueIndex("user_username_idx").on(t.username),
  })
);

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  issuer: text("issuer").notNull().default("provider-id"),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at", {
    withTimezone: true,
  }),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
    withTimezone: true,
  }),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// API tokens (account → "API keys" page in the user menu)
export const apiToken = pgTable(
  "api_token",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    token: text("token").notNull().unique(),
    apiKey: text("api_key").notNull(),
    lastUsedAt: timestamp("last_used_at", { withTimezone: true }),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    tokenIdx: uniqueIndex("api_token_token_idx").on(t.token),
  })
);

// Workspaces
export const workspace = pgTable(
  "workspace",
  {
    id: text("id").primaryKey(),
    name: varchar("name", { length: 64 }).notNull(),
    displayName: text("display_name"),
    description: text("description"),
    website: text("website"),
    logo: text("logo"),
    visibility: workspaceVisibilityEnum("visibility").notNull().default("private"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    nameIdx: uniqueIndex("workspace_name_idx").on(t.name),
  })
);

export const workspaceMember = pgTable(
  "workspace_member",
  {
    workspaceId: text("workspace_id")
      .notNull()
      .references(() => workspace.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: memberRoleEnum("role").notNull().default("normal"),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.workspaceId, t.userId] }),
  })
);

// Boards
export const board = pgTable(
  "board",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    description: text("description"),
    url: varchar("url", { length: 64 }).notNull(),
    isClosed: boolean("is_closed").notNull().default(false),
    isTemplate: boolean("is_template").notNull().default(false),
    isStarred: boolean("is_starred").notNull().default(false),
    visibility: boardVisibilityEnum("visibility").notNull().default("private"),
    defaultLists: boolean("default_lists").notNull().default(true),
    backgroundColor: varchar("background_color", { length: 7 }),
    backgroundImage: text("background_image"),
    backgroundBrightness: varchar("background_brightness", { length: 8 })
      .default("light"),
    workspaceId: text("workspace_id").references(() => workspace.id, {
      onDelete: "set null",
    }),
    ownerId: text("owner_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    prefs: jsonb("prefs").$type<Record<string, unknown>>().default({}),
    nextCardShortId: integer("next_card_short_id").notNull().default(1),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    urlIdx: uniqueIndex("board_url_idx").on(t.url),
    workspaceIdx: index("board_workspace_idx").on(t.workspaceId),
  })
);

export const boardMember = pgTable(
  "board_member",
  {
    boardId: text("board_id")
      .notNull()
      .references(() => board.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    role: memberRoleEnum("role").notNull().default("normal"),
    starred: boolean("starred").notNull().default(false),
    joinedAt: timestamp("joined_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.boardId, t.userId] }),
  })
);

export const boardStar = pgTable(
  "board_star",
  {
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    boardId: text("board_id")
      .notNull()
      .references(() => board.id, { onDelete: "cascade" }),
    pos: integer("pos").notNull().default(65535),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.boardId] }),
  })
);

// Labels
export const label = pgTable(
  "label",
  {
    id: text("id").primaryKey(),
    boardId: text("board_id")
      .notNull()
      .references(() => board.id, { onDelete: "cascade" }),
    name: text("name"),
    color: labelColorEnum("color").notNull().default("null"),
    uses: integer("uses").notNull().default(0),
  },
  (t) => ({
    boardColorIdx: uniqueIndex("label_board_color_idx").on(t.boardId, t.color),
  })
);

// Lists
export const list = pgTable(
  "list",
  {
    id: text("id").primaryKey(),
    boardId: text("board_id")
      .notNull()
      .references(() => board.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    pos: integer("pos").notNull(),
    isClosed: boolean("is_closed").notNull().default(false),
    subscribed: boolean("subscribed").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    boardPosIdx: index("list_board_pos_idx").on(t.boardId, t.pos),
  })
);

// Cards
export const card = pgTable(
  "card",
  {
    id: text("id").primaryKey(),
    boardId: text("board_id")
      .notNull()
      .references(() => board.id, { onDelete: "cascade" }),
    listId: text("list_id")
      .notNull()
      .references(() => list.id, { onDelete: "cascade" }),
    idShort: integer("id_short").notNull(),
    name: text("name").notNull(),
    desc: text("desc").notNull().default(""),
    descData: jsonb("desc_data").$type<Record<string, unknown>>(),
    pos: integer("pos").notNull(),
    due: timestamp("due", { withTimezone: true }),
    dueReminder: integer("due_reminder"),
    start: timestamp("start", { withTimezone: true }),
    dueComplete: boolean("due_complete").notNull().default(false),
    isClosed: boolean("is_closed").notNull().default(false),
    isTemplate: boolean("is_template").notNull().default(false),
    subscribed: boolean("subscribed").notNull().default(false),
    url: text("url").notNull(),
    sourceCardId: text("source_card_id"),
    mirrorSourceId: text("mirror_source_id"),
    coverColor: coverColorEnum("cover_color"),
    coverAttachmentId: text("cover_attachment_id"),
    coverBrightness: varchar("cover_brightness", { length: 8 }).default("light"),
    coverSize: varchar("cover_size", { length: 16 }).default("normal"),
    badges: jsonb("badges").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    listPosIdx: index("card_list_pos_idx").on(t.listId, t.pos),
    boardShortIdx: uniqueIndex("card_board_short_idx").on(t.boardId, t.idShort),
    boardIdx: index("card_board_idx").on(t.boardId),
  })
);

export const cardMember = pgTable(
  "card_member",
  {
    cardId: text("card_id")
      .notNull()
      .references(() => card.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.cardId, t.userId] }),
  })
);

export const cardLabel = pgTable(
  "card_label",
  {
    cardId: text("card_id")
      .notNull()
      .references(() => card.id, { onDelete: "cascade" }),
    labelId: text("label_id")
      .notNull()
      .references(() => label.id, { onDelete: "cascade" }),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.cardId, t.labelId] }),
  })
);

// Checklists
export const checklist = pgTable(
  "checklist",
  {
    id: text("id").primaryKey(),
    cardId: text("card_id")
      .notNull()
      .references(() => card.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    pos: integer("pos").notNull(),
    due: timestamp("due", { withTimezone: true }),
    dueReminder: integer("due_reminder"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    cardPosIdx: index("checklist_card_pos_idx").on(t.cardId, t.pos),
  })
);

export const checkItem = pgTable(
  "check_item",
  {
    id: text("id").primaryKey(),
    checklistId: text("checklist_id")
      .notNull()
      .references(() => checklist.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    state: varchar("state", { length: 16 }).notNull().default("incomplete"),
    pos: integer("pos").notNull(),
    due: timestamp("due", { withTimezone: true }),
    idMember: text("id_member").references(() => user.id, {
      onDelete: "set null",
    }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    checklistPosIdx: index("checkitem_checklist_pos_idx").on(
      t.checklistId,
      t.pos
    ),
  })
);

// Attachments
export const attachment = pgTable(
  "attachment",
  {
    id: text("id").primaryKey(),
    cardId: text("card_id")
      .notNull()
      .references(() => card.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    url: text("url").notNull(),
    bytes: integer("bytes"),
    mimeType: text("mime_type"),
    isUpload: boolean("is_upload").notNull().default(false),
    file: text("file"),
    preview: text("preview"),
    edgeColor: attachmentEdgeColorEnum("edge_color"),
    isCover: boolean("is_cover").notNull().default(false),
    idMember: text("id_member").references(() => user.id, {
      onDelete: "set null",
    }),
    date: timestamp("date", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    cardIdx: index("attachment_card_idx").on(t.cardId),
  })
);

// Stickers
export const sticker = pgTable(
  "sticker",
  {
    id: text("id").primaryKey(),
    cardId: text("card_id")
      .notNull()
      .references(() => card.id, { onDelete: "cascade" }),
    image: text("image").notNull(),
    imageUrl: text("image_url"),
    rotate: integer("rotate").notNull().default(0),
    top: integer("top").notNull().default(0),
    left: integer("left").notNull().default(0),
    zIndex: integer("z_index").notNull().default(0),
  },
  (t) => ({
    cardIdx: index("sticker_card_idx").on(t.cardId),
  })
);

// Actions (activity log)
export const action = pgTable(
  "action",
  {
    id: text("id").primaryKey(),
    boardId: text("board_id")
      .notNull()
      .references(() => board.id, { onDelete: "cascade" }),
    cardId: text("card_id").references(() => card.id, {
      onDelete: "set null",
    }),
    listId: text("list_id").references(() => list.id, {
      onDelete: "set null",
    }),
    memberCreatorId: text("member_creator_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: actionTypeEnum("type").notNull(),
    data: jsonb("data").$type<Record<string, unknown>>().default({}),
    reactionCount: integer("reaction_count").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    boardCreatedIdx: index("action_board_created_idx").on(t.boardId, t.createdAt),
    cardIdx: index("action_card_idx").on(t.cardId),
  })
);

export const reaction = pgTable(
  "reaction",
  {
    id: text("id").primaryKey(),
    actionId: text("action_id")
      .notNull()
      .references(() => action.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    emoji: text("emoji").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    uniqueActionUserEmoji: uniqueIndex("reaction_action_user_emoji_idx").on(
      t.actionId,
      t.userId,
      t.emoji
    ),
  })
);

// Notifications
export const notification = pgTable(
  "notification",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: notificationTypeEnum("type").notNull(),
    data: jsonb("data").$type<Record<string, unknown>>().default({}),
    actionId: text("action_id").references(() => action.id, {
      onDelete: "set null",
    }),
    boardId: text("board_id").references(() => board.id, {
      onDelete: "set null",
    }),
    cardId: text("card_id").references(() => card.id, { onDelete: "set null" }),
    unread: boolean("unread").notNull().default(true),
    dateRead: timestamp("date_read", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    userUnreadIdx: index("notification_user_unread_idx").on(t.userId, t.unread),
  })
);

// Board views
export const boardView = pgTable(
  "board_view",
  {
    id: text("id").primaryKey(),
    boardId: text("board_id")
      .notNull()
      .references(() => board.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    type: boardViewTypeEnum("type").notNull().default("board"),
    pos: integer("pos").notNull(),
    settings: jsonb("settings").$type<Record<string, unknown>>().default({}),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    boardPosIdx: index("board_view_board_pos_idx").on(t.boardId, t.pos),
  })
);

// Custom fields
export const customField = pgTable(
  "custom_field",
  {
    id: text("id").primaryKey(),
    boardId: text("board_id")
      .notNull()
      .references(() => board.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    type: customFieldTypeEnum("type").notNull(),
    options: jsonb("options").$type<{ id: string; value: { text: string }; color?: string }[]>().default([]),
    pos: integer("pos").notNull().default(65535),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    boardPosIdx: index("custom_field_board_pos_idx").on(t.boardId, t.pos),
  })
);

export const customFieldItem = pgTable(
  "custom_field_item",
  {
    id: text("id").primaryKey(),
    customFieldId: text("custom_field_id")
      .notNull()
      .references(() => customField.id, { onDelete: "cascade" }),
    cardId: text("card_id")
      .notNull()
      .references(() => card.id, { onDelete: "cascade" }),
    value: jsonb("value").$type<Record<string, unknown>>(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    fieldCardIdx: uniqueIndex("custom_field_item_field_card_idx").on(
      t.customFieldId,
      t.cardId
    ),
  })
);

// Power-Ups enabled per board
export const boardPowerUp = pgTable(
  "board_power_up",
  {
    boardId: text("board_id")
      .notNull()
      .references(() => board.id, { onDelete: "cascade" }),
    powerUpId: varchar("power_up_id", { length: 64 }).notNull(),
    enabled: boolean("enabled").notNull().default(true),
    settings: jsonb("settings").$type<Record<string, unknown>>().default({}),
    enabledAt: timestamp("enabled_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.boardId, t.powerUpId] }),
  })
);

// Automations (Butler)
export const automation = pgTable(
  "automation",
  {
    id: text("id").primaryKey(),
    boardId: text("board_id")
      .notNull()
      .references(() => board.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    description: text("description"),
    enabled: boolean("enabled").notNull().default(true),
    trigger: automationTriggerTypeEnum("trigger").notNull(),
    triggerData: jsonb("trigger_data").$type<Record<string, unknown>>().default({}),
    actions: jsonb("actions")
      .$type<{ type: string; data: Record<string, unknown> }[]>()
      .notNull()
      .default([]),
    createdById: text("created_by_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    boardIdx: index("automation_board_idx").on(t.boardId),
  })
);

export const automationRun = pgTable(
  "automation_run",
  {
    id: text("id").primaryKey(),
    automationId: text("automation_id")
      .notNull()
      .references(() => automation.id, { onDelete: "cascade" }),
    cardId: text("card_id").references(() => card.id, { onDelete: "set null" }),
    success: boolean("success").notNull().default(true),
    error: text("error"),
    ranAt: timestamp("ran_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    automationRanIdx: index("automation_run_automation_ran_idx").on(
      t.automationId,
      t.ranAt
    ),
  })
);

// Saved searches (Premium)
export const savedSearch = pgTable(
  "saved_search",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    boardId: text("board_id").references(() => board.id, {
      onDelete: "cascade",
    }),
    name: text("name").notNull(),
    query: text("query").notNull(),
    pos: integer("pos").notNull().default(65535),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    userPosIdx: index("saved_search_user_pos_idx").on(t.userId, t.pos),
  })
);

// Webhooks
export const webhook = pgTable(
  "webhook",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    boardId: text("board_id").references(() => board.id, {
      onDelete: "cascade",
    }),
    callbackURL: text("callback_url").notNull(),
    description: text("description"),
    active: boolean("active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    boardIdx: index("webhook_board_idx").on(t.boardId),
  })
);

// Undo log (5s window)
export const undoEntry = pgTable(
  "undo_entry",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    boardId: text("board_id").references(() => board.id, {
      onDelete: "set null",
    }),
    action: varchar("action", { length: 64 }).notNull(),
    data: jsonb("data").$type<Record<string, unknown>>().notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => ({
    userExpiresIdx: index("undo_entry_user_expires_idx").on(t.userId, t.expiresAt),
  })
);

// Board background image (uploads)
export const boardBackground = pgTable(
  "board_background",
  {
    id: text("id").primaryKey(),
    boardId: text("board_id")
      .notNull()
      .references(() => board.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    brightness: varchar("brightness", { length: 8 }).default("light"),
    uploadedById: text("uploaded_by_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  }
);

// Relations
export const userRelations = relations(user, ({ many }) => ({
  boards: many(board, { relationName: "owner" }),
  memberships: many(boardMember),
  workspaceMemberships: many(workspaceMember),
  cards: many(cardMember),
  createdActions: many(action),
  notifications: many(notification),
  apiTokens: many(apiToken),
}));

export const workspaceRelations = relations(workspace, ({ many }) => ({
  boards: many(board),
  members: many(workspaceMember),
}));

export const workspaceMemberRelations = relations(workspaceMember, ({ one }) => ({
  workspace: one(workspace, {
    fields: [workspaceMember.workspaceId],
    references: [workspace.id],
  }),
  user: one(user, {
    fields: [workspaceMember.userId],
    references: [user.id],
  }),
}));

export const boardRelations = relations(board, ({ many, one }) => ({
  lists: many(list),
  members: many(boardMember),
  stars: many(boardStar),
  labels: many(label),
  views: many(boardView),
  actions: many(action),
  automations: many(automation),
  powerUps: many(boardPowerUp),
  customFields: many(customField),
  workspace: one(workspace, {
    fields: [board.workspaceId],
    references: [workspace.id],
  }),
  owner: one(user, {
    fields: [board.ownerId],
    references: [user.id],
    relationName: "owner",
  }),
}));

export const boardMemberRelations = relations(boardMember, ({ one }) => ({
  board: one(board, {
    fields: [boardMember.boardId],
    references: [board.id],
  }),
  user: one(user, {
    fields: [boardMember.userId],
    references: [user.id],
  }),
}));

export const listRelations = relations(list, ({ one, many }) => ({
  board: one(board, {
    fields: [list.boardId],
    references: [board.id],
  }),
  cards: many(card),
}));

export const cardRelations = relations(card, ({ one, many }) => ({
  board: one(board, {
    fields: [card.boardId],
    references: [board.id],
  }),
  list: one(list, {
    fields: [card.listId],
    references: [list.id],
  }),
  members: many(cardMember),
  labels: many(cardLabel),
  checklists: many(checklist),
  attachments: many(attachment),
  stickers: many(sticker),
  actions: many(action),
  customFieldItems: many(customFieldItem),
}));

export const cardMemberRelations = relations(cardMember, ({ one }) => ({
  card: one(card, {
    fields: [cardMember.cardId],
    references: [card.id],
  }),
  user: one(user, {
    fields: [cardMember.userId],
    references: [user.id],
  }),
}));

export const cardLabelRelations = relations(cardLabel, ({ one }) => ({
  card: one(card, {
    fields: [cardLabel.cardId],
    references: [card.id],
  }),
  label: one(label, {
    fields: [cardLabel.labelId],
    references: [label.id],
  }),
}));

export const labelRelations = relations(label, ({ one, many }) => ({
  board: one(board, {
    fields: [label.boardId],
    references: [board.id],
  }),
  cards: many(cardLabel),
}));

export const checklistRelations = relations(checklist, ({ one, many }) => ({
  card: one(card, {
    fields: [checklist.cardId],
    references: [card.id],
  }),
  items: many(checkItem),
}));

export const checkItemRelations = relations(checkItem, ({ one }) => ({
  checklist: one(checklist, {
    fields: [checkItem.checklistId],
    references: [checklist.id],
  }),
  assignee: one(user, {
    fields: [checkItem.idMember],
    references: [user.id],
  }),
}));

export const attachmentRelations = relations(attachment, ({ one }) => ({
  card: one(card, {
    fields: [attachment.cardId],
    references: [card.id],
  }),
  uploader: one(user, {
    fields: [attachment.idMember],
    references: [user.id],
  }),
}));

export const actionRelations = relations(action, ({ one, many }) => ({
  board: one(board, {
    fields: [action.boardId],
    references: [board.id],
  }),
  card: one(card, {
    fields: [action.cardId],
    references: [card.id],
  }),
  list: one(list, {
    fields: [action.listId],
    references: [list.id],
  }),
  memberCreator: one(user, {
    fields: [action.memberCreatorId],
    references: [user.id],
  }),
  reactions: many(reaction),
}));

export const reactionRelations = relations(reaction, ({ one }) => ({
  action: one(action, {
    fields: [reaction.actionId],
    references: [action.id],
  }),
  user: one(user, {
    fields: [reaction.userId],
    references: [user.id],
  }),
}));

export const customFieldRelations = relations(customField, ({ one, many }) => ({
  board: one(board, {
    fields: [customField.boardId],
    references: [board.id],
  }),
  items: many(customFieldItem),
}));

export const customFieldItemRelations = relations(customFieldItem, ({ one }) => ({
  field: one(customField, {
    fields: [customFieldItem.customFieldId],
    references: [customField.id],
  }),
  card: one(card, {
    fields: [customFieldItem.cardId],
    references: [card.id],
  }),
}));

export const automationRelations = relations(automation, ({ one, many }) => ({
  board: one(board, {
    fields: [automation.boardId],
    references: [board.id],
  }),
  runs: many(automationRun),
  createdBy: one(user, {
    fields: [automation.createdById],
    references: [user.id],
  }),
}));

export const automationRunRelations = relations(automationRun, ({ one }) => ({
  automation: one(automation, {
    fields: [automationRun.automationId],
    references: [automation.id],
  }),
  card: one(card, {
    fields: [automationRun.cardId],
    references: [card.id],
  }),
}));

export const boardViewRelations = relations(boardView, ({ one }) => ({
  board: one(board, {
    fields: [boardView.boardId],
    references: [board.id],
  }),
}));

export const boardPowerUpRelations = relations(boardPowerUp, ({ one }) => ({
  board: one(board, {
    fields: [boardPowerUp.boardId],
    references: [board.id],
  }),
}));

export const stickerRelations = relations(sticker, ({ one }) => ({
  card: one(card, {
    fields: [sticker.cardId],
    references: [card.id],
  }),
}));

export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;
export type Board = typeof board.$inferSelect;
export type NewBoard = typeof board.$inferInsert;
export type List = typeof list.$inferSelect;
export type NewList = typeof list.$inferInsert;
export type Card = typeof card.$inferSelect;
export type NewCard = typeof card.$inferInsert;
export type Workspace = typeof workspace.$inferSelect;
export type Label = typeof label.$inferSelect;
export type Checklist = typeof checklist.$inferSelect;
export type CheckItem = typeof checkItem.$inferSelect;
export type Attachment = typeof attachment.$inferSelect;
export type Action = typeof action.$inferSelect;
export type Notification = typeof notification.$inferSelect;
export type Automation = typeof automation.$inferSelect;
export type CustomField = typeof customField.$inferSelect;
export type CustomFieldItem = typeof customFieldItem.$inferSelect;
export type BoardView = typeof boardView.$inferSelect;
