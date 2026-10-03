-- Store API credentials as SHA-256 digests instead of plaintext, so a database
-- dump cannot be replayed against the API.
--
-- The old columns are dropped and new NOT NULL columns added rather than
-- renamed: a rename would carry existing plaintext into a column named
-- `token_hash`, quietly misrepresenting the data. `ADD COLUMN ... NOT NULL`
-- without a default fails when the table has rows, which is the guard we want
-- — existing tokens must be revoked and reissued, not silently reinterpreted.
-- An earlier `db:push` left a redundant UNIQUE *constraint* alongside the plain
-- index. A constraint owns its index, so it has to be dropped as a constraint —
-- `DROP INDEX` on it fails.
ALTER TABLE "api_token" DROP CONSTRAINT IF EXISTS "api_token_token_unique";
--> statement-breakpoint
DROP INDEX IF EXISTS "api_token_token_idx";
--> statement-breakpoint
ALTER TABLE "api_token" DROP COLUMN IF EXISTS "token";
--> statement-breakpoint
ALTER TABLE "api_token" DROP COLUMN IF EXISTS "api_key";
--> statement-breakpoint
ALTER TABLE "api_token" ADD COLUMN "token_hash" text NOT NULL;
--> statement-breakpoint
ALTER TABLE "api_token" ADD COLUMN "api_key_hash" text NOT NULL;
--> statement-breakpoint
ALTER TABLE "api_token" ADD COLUMN "token_hint" text;
--> statement-breakpoint
CREATE UNIQUE INDEX "api_token_token_hash_idx" ON "api_token" USING btree ("token_hash");
--> statement-breakpoint
CREATE INDEX "api_token_api_key_hash_idx" ON "api_token" USING btree ("api_key_hash");
