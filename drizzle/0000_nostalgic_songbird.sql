CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text
);
--> statement-breakpoint
CREATE TABLE "deployments" (
	"id" text PRIMARY KEY NOT NULL,
	"project_name" text,
	"commit_hash" text,
	"branch" text,
	"status" text,
	"duration" text,
	"timestamp" text,
	"repo_full_name" text,
	"runtime" text,
	"image" text,
	"subdomain" text
);
--> statement-breakpoint
CREATE TABLE "repos" (
	"id" text PRIMARY KEY NOT NULL,
	"project_name" text,
	"description" text,
	"commit_hash" text,
	"branch" text,
	"status" text,
	"duration" text,
	"timestamp" text,
	"full_name" text,
	"html_url" text
);
