<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project Goal: Vio — Trello-compatible Workspace

**Vio** is a Trello-compatible boards-and-cards workspace. Trello remains the single source of truth for behavior, microcopy, shortcuts, and the URL surface (per the spec below). Where Vio differs from Trello, it is intentional: the brand (Vio), the visual identity, the product copy ("Add card", "Move to top", etc. — match Trello's), and any new feature that doesn't exist in Trello is rejected.

**Rule of thumb:**
1. *Does Trello do this?* → mirror it (label palette, domain model, copy, shortcuts, URLs).
2. *Does Vio need to brand it?* → use `BRAND.name` / `Vio` from `lib/brand.ts`, the Vio logo in `components/brand/vio-logo.tsx`, and the Vio violet tokens (`bg-vio`, `text-vio`, `bg-vio-hover`).
3. *Is this a new product idea not in Trello?* → reject. Out of scope.

This project is a **pixel-and-feature-faithful clone of Atlassian Trello**. Every piece of functionality Trello exposes to its users — boards, lists, cards, power-ups, automations, sharing, billing, mobile, keyboard shortcuts, the lot — must be reproduced here. Treat the Trello web app and mobile app as the single source of truth. If Trello does it, we do it. If Trello doesn't, it is out of scope.

When implementing anything, open Trello in a browser/phone and mirror the behavior: the layout, the microcopy, the empty states, the error states, the loading states, the animations, the icons, the keyboard shortcuts, the menus, the URLs, the URL slugs, the toasts, the confirmation dialogs. Match the wording of buttons and menu items verbatim where it makes the product feel like Trello (e.g. "Add card", "Move to top", "Watch", "Join board", "Mark as complete").

Do not invent new product surface area. If you are about to add a feature, ask first: *where is this in Trello?* If the answer is "nowhere", reject it.

---

## 1. Core Domain Model

The Trello domain is built on a small set of entities. Mirror them exactly.

### Entities
- **User** — a person who can sign in. Has `username`, `fullName`, `initials`, `avatar` (color + initials when no upload), `email`. Username is unique, slug-like, used in URLs (`/u/username`).
- **Workspace** *(Trello Standard/Premium feature; expose it as a first-class object even if the UI is minimal)* — a container of boards. Has `name`, `displayName`, `description`, `website`, `logo`, members, and visibility (`private`, `public`).
- **Board** — the central object. Has `name`, `description`, `isClosed` (archived), `isTemplate`, `isStarred`, `prefs` (see below), `defaultLists` (toggle for the To-Do/Doing/Done starter lists), `background` (color, gradient, or uploaded image), `url` (slug), `memberships`, `labels`, `lists`, `powerUps`, `automations`, `views`.
- **List** — a column inside a board. Has `name`, `position` (float, Trello uses 16384-step increments), `isClosed` (archived), `idBoard`, `subscribed` (per-list watchers), `cards`.
- **Card** — a card in a list. Has `name`, `desc`, `descData` (emoji map), `due`, `dueReminder`, `start`, `dueComplete`, `isClosed` (archived), `idList`, `idBoard`, `pos`, `idShort` (per-board short number), `url`, `source` (source card id if duplicated), `idMembers` (assigned), `idLabels`, `labels`, `cover` (color, image, or attachment), `attachments`, `checklists`, `comments` (actions of type `commentCard`), `stickers`, `customFieldItems`, `badges`, `subscribed`, `mirrorSourceId`, `isTemplate`, `creationAt`, `modificationAt`.
- **Label** — board-scoped color tag. Has `name`, `color`, `idBoard`, `uses`.
- **Checklist** — child of a card. Has `name`, `idCard`, `pos`, `checkItems`, `due`, `dueReminder`.
- **CheckItem** — line in a checklist. Has `name`, `state` (`incomplete` | `complete`), `pos`, `due`, `idMember`.
- **Attachment** — file or link attached to a card. Has `name`, `url`, `bytes`, `mimeType`, `date`, `isUpload`, `file`, `preview`, `edgeColor`, `cover`, `isCover`, `idMember`.
- **Comment** — stored as an `Action` of type `commentCard` on the card.
- **Action** — every event on a board is an Action (createCard, updateCard, moveCard, commentCard, addMemberToCard, addAttachmentToCard, addChecklistToCard, copyComment, etc.). Actions power the activity feed, notifications, and undo. Mirror the full type taxonomy.
- **Notification** — derived from actions; `unread`, `type`, `data`, `dateRead`.
- **CustomField / CustomFieldItem** — Premium Power-Up: per-board definitions, per-card values. Types: `text`, `number`, `date`, `checkbox`, `list`, `dropdown`.
- **Power-Up** *(first-class object even before the UI ships)* — enabled features per board (`voting`, `custom-fields`, `calendar`, `card-repeat`, `slack`, etc.).
- **Automation** — Butlers: triggers (`when-card-added`, `due-soon`, …) and rule actions (`add-to-list`, `set-due-date`, `move-card-to-top`, `post-comment`, `send-email`, …).
- **Plan / Billing** — Free, Standard, Premium, Enterprise tiers. Each gates features (see §13).

### IDs and URLs
- Internal IDs are MongoDB-like, opaque, 24-char hex strings.
- Card short IDs (`idShort`) are sequential per board starting at 1 and shown in URLs like `/c/<short>`.
- Boards have a slug (`url` / `urlName`) used in URLs: `/b/<workspace>/<boardSlug>` or `/b/<boardSlug>`.
- Mirror Trello's URL surface: `/`, `/login`, `/signup`, `/u/<username>`, `/b/<board>`, `/c/<short>`, `/1/Members`, `/1/Activity`, etc.

---

## 2. Authentication and Account

Match Trello end-to-end:
- Sign up with email + full name, or continue with Google / Microsoft / Apple / Slack SSO providers.
- Login by email or username + password, or SSO. Forgot password flow with emailed reset link.
- Email verification on signup.
- "Stay signed in" toggle (long-lived refresh cookie).
- Two-factor authentication (TOTP) — account setting.
- Manage account: email, password, profile name, username, avatar, bio, initials, language, timezone, locale.
- Sessions management: list active sessions, sign out individual sessions, sign out everywhere.
- API keys page (account → API keys) — generate personal API tokens.
- Atlassian account menu in the top-right with "Profile and visibility", "Activity", "Cards", "Settings", "Help", "Log out".

---

## 3. Workspace and Sidebar

- Left rail: Home (starred boards + recent + templates), Workspaces section, Boards section, Templates, Member directory, Power-Ups directory.
- "Create" button (workspace, board, template).
- Workspace switcher in the header (avatar + workspace name).
- Personal boards vs workspace boards vs team boards.
- Visibility controls per workspace (Private/Public).
- Drag to reorder workspaces, drag boards into a workspace.

---

## 4. Boards

### Board header
- Board title (click to rename inline), star toggle, visibility chip (Private/Public/Workspace), board description ("View description" → modal).
- Members avatars (click "+ Invite"), filter-by-member dropdown, search bar.
- Right-side icons in this order: **Automation**, **Power-Ups**, **Filter**, **Stickers**, **Share / Menu**.
- Board menu (rightmost): "About this board", "Activity", "Archived items", "Watch", "Print", "Close board", "Labels", "Automation", "Power-Ups", "Automation rules".

### Views
- **Board** view (default, kanban).
- **Timeline** view (Power-Up, premium) — calendar/gantt of cards by due/start.
- **Calendar** view — month grid of cards by due date.
- **Table** view — columns: card name, labels, members, due date, attachments, checklists, custom fields.
- **Dashboard** view — charts (cards by list, by label, by member, by due date).
- View tabs at the top of the board, click to switch, drag to reorder.
- "Add view" button — create another view of any supported type.

### Board backgrounds
- Colors, gradients, custom uploads. Persist and apply to header. Member can change from board menu → "Change background".

### Templates
- Any board can be made a template ("Make template"). Templates appear in the template gallery. "Create board from template" duplicates lists, cards, labels, checklists, attachments, comments, custom fields, and view settings.

---

## 5. Lists

- Add list button at the end; "+ Add another list" inline.
- List header: click to rename, drag handle, menu: "Add card", "Copy list", "Move list", "Sort by…", "Watch", "Move all cards in this list…", "Archive this list", "Archive all cards in this list…".
- Reorder lists horizontally with drag-and-drop. Drop position is interpolated.
- Archive list → goes to "Archived items". Restore from there.
- "Move all cards in this list" moves to another open list.

---

## 6. Cards

### Card front
- Name (3–4 lines truncation), labels (color chips across top), cover (color strip or attached image — full-width or with offset), member avatars, due date chip (overdue = red, due-soon = yellow, complete = strikethrough), attachment count, comment count, checklist progress (e.g. `3/7`), custom field chips.
- Drag to reorder within a list (sparse float position) and to move across lists.

### Card back (modal)
Opens to a full-card view. Sections in Trello's order:
1. **Header** — card name (inline editable), list breadcrumb (`Board › List`), star toggle, share button.
2. **Members / Labels / Due date / Cover** — action chips row.
3. **Description** — rich-text editor (bold/italic/strikethrough, code, lists, headings, links, mentions `@username`, emojis). Markdown storage, `descData` for emoji positions.
4. **Checklists** — add checklist, show progress, "Convert to card" on each item, hide/show completed items, reorder, due dates per item.
5. **Attachments** — drag/drop or attach from URL/computer. Cover image picker (unattach or attach any of the card's attachments). Inline preview for images/PDFs. Comment on attachment.
6. **Custom fields** — Premium: rendered below attachments.
7. **Comments** — thread, with reactions (emoji), edit/delete, "Copy comment" creates a new card with that comment as its description (Trello feature), @mentions notify.
8. **Activity** — chronological actions, filter by action type, follow reactions.
9. **Sidebar actions menu (right rail)**: Move, Copy, Mirror, Make template, Archive, Share, Vote (Power-Up), Watch, Copy link, Add to Trello (iOS/Android handoff), Export as JSON/PDF.

### Card actions
- Add, archive (close), delete (archive; Trello "delete" is essentially archive), restore, move to list, reorder, duplicate (with attachments? yes — match Trello's "Include... attachments, checklists, labels, members" dialog), mirror (live sync between boards).
- "Make template" promotes a card to a template card.

---

## 7. Labels

- Per-board label colors: yellow, purple, orange, green, blue, red, lime, sky, pink, black (match Trello's palette exactly with hex values).
- Create label with name + color. Edit name. Delete label (deletes from all cards).
- Filter board by labels via header filter.
- Edit labels from board menu → Labels, or per-card via "Labels" action.
- "Copy label" copies from another board.

---

## 8. Members, Sharing, Permissions

- Add members by email, username, or invite link. Multiple roles:
  - **Admin** — full control.
  - **Normal** — edit.
  - **Observer** — read-only.
  - Per-board. Per-workspace roles for workspace admins.
- Board visibility:
  - **Private** — only members.
  - **Team** — any workspace member.
  - **Organization (Public)** — anyone with link (Trello classic terminology). Modern Trello uses **Workspace** + Public.
- "Share" dialog: copy private link (private to logged-in members), "Invite by email", permission dropdown, "Get shareable link" toggle.
- Watch / unwatch board or card. Per-member notification settings (Subscribed/Unsubscribed/Watching).
- Member directory: list all members with their boards and recent activity.

---

## 9. Search

- Global search header bar: results grouped into Cards, Boards, Members.
- Card search supports operators: `is:open`, `is:archived`, `is:starred`, `due:overdue`, `due:today`, `due:week`, `due:month`, `due:none`, `label:bug`, `member:@alice`, `list:"In Progress"`, `board:"Roadmap"`, `has:attachments`, `has:description`, `has:checklists`, `has:due`, `has:cover`, `created:day`, `edited:week-1`, etc.
- In-board filter (`Filter` button): same operators scoped to the current board. Filter chips above the lists.
- Card quick-find (`/` keyboard shortcut while looking at a board): search-as-you-type within the board.
- Saved searches (Premium): bookmark a filtered view as a tab.

---

## 10. Activity, Notifications, Undo

- **Activity feed** on board (`/b/<board>/activity`) — every Action in reverse chronological order, filterable by member, action type, date.
- **User activity** (`/u/<username>/activity`) — public activity feed per user.
- **Notifications** bell in header: unread count badge. List of recent notifications, "mark all as read". Email notifications preferences.
- **Undo** (Ctrl+Z): every mutating action should be undoable for ~5 seconds via toast at the bottom ("Card moved — Undo"). Persist a stack of reversible ops server-side or client-side.
- **Watch** toggles: per-board, per-list, per-member. Watch = subscribe to all changes within that scope.

---

## 11. Automation (Butler)

- Per-board automation rules. **Triggers**:
  - When a card is added to list X
  - When a card is added with label X
  - When a card is due in (1 day, 1 hour, etc.)
  - When a checklist item is completed
  - When a card is moved into list X
  - Every day / week / month at time
  - When a button is clicked ("Card buttons")
- **Actions**:
  - Move card to list
  - Add/remove label
  - Set due date (relative: "today + 3 days")
  - Add member
  - Post comment
  - Mark due complete
  - Move to top/bottom of list
  - Archive card
  - Copy card to list
  - Move card to another board
  - Add to / remove from checklist
  - Send email
- Calendar commands: `due in 3 days`, `every monday at 9am`, etc.
- Button cards: place a card with title "Button" and a custom button that runs actions when clicked.
- Display: dedicated "Automation" tab and per-board automation page with rule cards, edit, enable/disable, delete, run history.

---

## 12. Power-Ups

- Built-in power-ups to ship:
  - **Custom Fields** (Premium): text, number, date, checkbox, list, dropdown.
  - **Card Repeater**: auto-respawn a card on a schedule.
  - **Voting**: 👍 votes on cards, threshold auto-archive.
  - **Calendar**: free due-date calendar view.
  - **Time Tracker / Time in List**.
  - **Card Aging**: visualize stale cards (corners darken over time).
  - **Comments / Reactions** is built-in but reactions are first-class.
- Power-Up directory with install/uninstall per board. Per-power-up settings UI.
- Trello also has many 3rd-party Power-Ups (Slack, GitHub, Jira, Confluence, Dropbox, OneDrive, Box, Bitium, Zendesk, Salesforce, etc.). We do **not** ship integrations with external SaaS in this clone, but the UI surfaces for "Power-Ups" and the iframe-style installation flow must exist.

---

## 13. Plans, Limits, and Billing

Mirror the Trello tier matrix:

### Free
- Up to 10 personal boards.
- Unlimited cards, lists, members on personal boards.
- 1 Power-Up per board (some).
- 1 automation run/month (Butler).
- No custom fields, no timeline/table/dashboard views.
- File attachments up to 10 MB.

### Standard
- Unlimited boards.
- Unlimited Power-Ups on a board (no, Trello is "unlimited" but with quota? Match: unlimited Power-Ups per board).
- More automation runs.
- Larger attachments.

### Premium
- Multiple views (Timeline, Calendar, Table, Dashboard, Map).
- Custom Fields.
- Saved searches.
- Larger attachments.
- More automation runs.
- Workspace-level controls.

### Enterprise
- SSO, user provisioning.
- Audit logs.
- Multi-board automation.
- Org-wide analytics.

Build a billing screen that lists plans, features per plan, CTA "Upgrade", "Contact sales". Use Stripe (or compatible) for payment. Show "Current plan" pill in the account menu. Enforce quotas server-side and via UI gating (banner with upgrade CTA when hitting limits).

---

## 14. Templates Gallery

- Browse templates by category: Project Management, Engineering, HR, Marketing, Education, Design, Product, Small Business, Remote Work, Personal, Sales & CRM, Support, Operations, Carts & checkouts (wait — that's Shopify; ignore). Stick to Trello's real categories.
- Featured, trending, new-and-noteworthy.
- Template preview, "Use template" button (creates a new board from it).
- "Create board from template" duplicates lists, cards, labels, checklists, attachments, comments, custom fields, view settings, and **memberships? no — empty for the new board**.
- Submit your own template (gated by plan).

---

## 15. Keyboard Shortcuts

Match Trello's keyboard map **exactly**:

- `b` — open boards menu
- `/` — focus search / quick card finder on a board
- `c` — archive a card (when card focused)
- `e` — edit card name
- `f` — open filter
- `esc` — close modal / clear focus
- `?` — keyboard shortcuts cheat sheet
- `space` / `enter` on a card → open card
- `→` / `←` when card modal open → next/prev card
- `[` / `]` — archive / send to bottom (in list view, focused card)
- `Shift` + drag — multi-select cards
- `Ctrl/Cmd + Z` — undo last action (board scope)
- `Ctrl/Cmd + Enter` — submit inline edits / save card description
- `m` — add member (in card back)
- `l` — add label (in card back)
- `d` — set due date (in card back)
- `a` — add attachment
- `w` — toggle watch
- `n` — new card (when list focused)
- `#` — new list
- `1..9` — quick switch workspace / pinned boards (match Trello's behavior)
- `Tab` — focus next interactive element (stick to the standard a11y order)

Make a `/help` cheat sheet modal reachable with `?`.

---

## 16. Mobile and Responsive

- Responsive web: at <768px the board becomes a vertical stack of lists with a switcher pill at the top to jump between lists. Header collapses. Card modal takes full screen.
- Tablet: 2-column lists, modal 60% width.
- A native-style mobile layout (if shipping a PWA or React Native wrapper) must match Trello mobile: bottom sheet for card actions, swipe a card to archive, long-press to multi-select.
- Touch gestures: drag to reorder, pinch-to-zoom on board background.

---

## 17. Offline, Realtime, Performance

- Realtime multi-user editing: WebSocket / Server-Sent Events so two users see each other's moves live (Trello updates in <100ms in our LAN).
- Optimistic UI for drag-and-drop and card edits.
- Offline mode: queue mutations in IndexedDB / localStorage, replay on reconnect.
- Service worker for static assets.

---

## 18. Files, Uploads, and Previews

- Attach via file picker, drag/drop, or paste from clipboard.
- Inline previews for images (jpg/png/gif/webp/svg), PDF (first page), video (mp4/webm), audio (mp3/wav). Generic file icon otherwise.
- Thumbnail generation server-side. Store originals.
- Cover images: pick from card attachments. Remove cover.
- Attachment size limits per plan (10 MB free, larger on Premium). Enforce MIME types.
- Paste URL → embed (Trello auto-embeds YouTube, Vimeo, Figma, Loom, etc.). Implement a small allowlist.

---

## 19. Internationalization and Accessibility

- I18n: support en-US (default), plus any others Trello supports (de, es, fr, it, nl, pl, pt-BR, ru, tr, ja, ko, zh-CN, zh-TW, etc.). Resource files per locale.
- RTL layout for Arabic/Hebrew.
- Locale-aware date formatting (Trello shows dates like "Apr 5", "Tomorrow", "Yesterday", "Last Monday", then full date on hover).
- Timezone-aware due dates; user can set timezone in account.
- Accessibility:
  - Full keyboard navigation, focus rings, skip-to-content.
  - ARIA roles on lists (`role="list"`), cards (`role="article"`), dialogs, menus, tooltips.
  - Color contrast ≥ WCAG AA.
  - Screen reader announcements for board updates (use `aria-live="polite"`).
  - High contrast mode support.
  - Reduced motion: respect `prefers-reduced-motion`.

---

## 20. Notifications, Email, and Integrations

- Email notifications per board/card: every action, only mentions/due dates, or off.
- Daily / weekly digest option.
- Welcome, board invitation, mention, due-soon, overdue emails.
- Templates match Trello's tone.

---

## 21. Theming

- Light, Dark, and "Match system" themes.
- Board backgrounds can override theme for the board header only (Trello does this).

---

## 22. Analytics and Admin

- Event tracking for product analytics (board created, card moved, automation ran, …).
- Workspace/Enterprise admin: members, permissions, audit log, security (SSO), billing.
- Account-level activity log.

---

## 23. API

Expose the same surface as Trello's REST API (so third-party clones of Trello client apps can talk to us):

- `GET/POST /1/members`
- `GET/POST /1/members/me`
- `GET/POST /1/boards` and full CRUD
- `GET/POST /1/boards/{id}/lists`
- `GET/POST /1/lists/{id}/cards`
- `GET/POST /1/cards` (and `?idShort=` etc.)
- `GET/POST /1/cards/{id}/actions`
- `GET/POST /1/cards/{id}/attachments`
- `GET/POST /1/cards/{id}/checklists`
- `GET/POST /1/checklists/{id}/checkItems`
- `GET/POST /1/labels`
- `GET/POST /1/actions/{id}/reactions`
- `GET /1/search?query=...&modelTypes=...`
- `GET /1/notifications`
- Webhooks: `POST /1/webhooks`, deliveries for actions.
- API key + token auth (Basic auth style like Trello).
- OpenAPI spec published.

The frontend should be able to drive the same actions through our own routes; treat internal calls and external API calls as the same handlers.

---

## 24. Engineering Rules of Thumb

- Use Next.js App Router conventions in `app/`. Read `node_modules/next/dist/docs/` before writing any Next.js code — this Next.js has breaking changes.
- Server actions or route handlers must be the single source of truth; both the React UI and the public API hit them.
- All mutating endpoints must produce an `Action` and emit a realtime event.
- Every mutation must support undo for ~5s.
- Permissions enforced server-side; never trust the client.
- Input validation with a single schema layer (e.g. Zod) shared by API and form submissions.
- Data layer: model entities close to the §1 schema. Use a DB that gives you change streams if possible for the realtime + activity log.
- Use TanStack Query (or similar) for client state with optimistic updates.
- Drag-and-drop library that handles virtualized lists and multi-select (dnd-kit).
- Component library: keep the look identical to Trello. Reuse icons from a Lucide-style set that visually matches (or use the actual Trello-style iconography in `public/`).
- No inventing copy. Use Trello's strings. Pull them from Trello's own resources where public, otherwise phrase them in Trello's voice ("Add card", "Move card", "This card", etc.).
- Tests: unit for domain logic, integration for API, end-to-end Playwright for flows (sign up, create board, create card, drag, add checklist, add member, comment, run automation, view activity).

---

## 25. Definition of Done for a Feature

A feature is **not done** until:
1. The behavior is indistinguishable from Trello in a side-by-side comparison.
2. All keyboard shortcuts, empty states, loading states, error states, and toasts match Trello.
3. Realtime sync works between at least two clients.
4. Undo works for every mutation it produces.
5. Activity, notifications, and search all reflect it.
6. Mobile responsive layout works at 320, 375, 768, 1024, 1440, 1920 widths.
7. Accessibility: keyboard, screen reader, color contrast pass.
8. Permissions enforced for every role.
9. Plan limits enforced (where applicable).
10. Documented in this file and the README.

---

## 26. Out of Scope

To keep us honest about what "every aspect of Trello" means, the following are **explicitly not in scope** unless we later add them:
- Voice / video calls inside cards.
- The Atlassian Confluence / Jira / Bitbucket cross-product integrations (we'll mirror the UI placeholders, not the real wiring).
- Slack / Microsoft Teams / Outlook integration beyond UI surfaces.
- AI features ("Trello AI", "Atlassian Intelligence").
- Trello Gold/Platinum legacy badge logic (Trello has deprecated most of these).
- Third-party Power-Up marketplace submissions (the marketplace UI exists; we don't accept submissions).
- Marketing pages beyond what's needed to onboard a user.

Everything else listed above is in scope.

---

## 27. Reference Behavior to Always Re-Check

When in doubt, open Trello and:
1. Try the feature.
2. Look at the URL.
3. Look at the menu items.
4. Look at the keyboard shortcut.
5. Look at the empty state.
6. Look at the error state.
7. Look at the toast and undo.
8. Look at the activity entry it produces.

Then mirror it.