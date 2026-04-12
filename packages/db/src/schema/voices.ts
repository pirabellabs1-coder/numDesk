import { pgTable, uuid, varchar, text, integer, boolean, timestamp, pgEnum } from "drizzle-orm/pg-core";

export const voiceProviderTypeEnum = pgEnum("voice_provider_type", ["cartesia", "elevenlabs", "google", "custom"]);
export const voiceQualityEnum = pgEnum("voice_quality", ["premium", "standard", "custom"]);
export const trainingStatusEnum = pgEnum("training_status", ["ready", "uploading", "training", "completed", "failed"]);

export const voices = pgTable("voices", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  provider: voiceProviderTypeEnum("provider").notNull(),
  voiceId: varchar("voice_id", { length: 255 }),
  language: varchar("language", { length: 10 }).default("fr-FR").notNull(),
  gender: varchar("gender", { length: 10 }).default("female"),
  quality: voiceQualityEnum("quality").default("standard").notNull(),
  sampleUrl: text("sample_url"),
  isActive: boolean("is_active").default(true).notNull(),
  trainingStatus: trainingStatusEnum("training_status").default("ready").notNull(),
  trainingProgress: integer("training_progress").default(0),
  modelPath: text("model_path"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const voiceSamples = pgTable("voice_samples", {
  id: uuid("id").primaryKey().defaultRandom(),
  voiceId: uuid("voice_id").references(() => voices.id, { onDelete: "cascade" }).notNull(),
  fileUrl: text("file_url").notNull(),
  fileName: varchar("file_name", { length: 255 }).notNull(),
  durationSeconds: integer("duration_seconds"),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).defaultNow().notNull(),
});
