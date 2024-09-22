CREATE TABLE IF NOT EXISTS "passwordResetToken" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "passwordResetToken_token_unique" UNIQUE("token")
);
--> statement-breakpoint
ALTER TABLE "verificationToken" ADD CONSTRAINT "verificationToken_token_unique" UNIQUE("token");