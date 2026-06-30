CREATE TABLE `routines` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`auto_advance` integer DEFAULT false NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `routines_user_id_idx` ON `routines` (`user_id`);--> statement-breakpoint
CREATE TABLE `blocks` (
	`id` text PRIMARY KEY NOT NULL,
	`routine_id` text NOT NULL,
	`type` text NOT NULL,
	`title` text NOT NULL,
	`duration_minutes` integer NOT NULL,
	`position` integer NOT NULL,
	`background` text,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`routine_id`) REFERENCES `routines`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `blocks_routine_id_idx` ON `blocks` (`routine_id`);--> statement-breakpoint
CREATE INDEX `blocks_routine_position_idx` ON `blocks` (`routine_id`,`position`);
