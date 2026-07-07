import { pgTable, text, integer, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const languagesTable = pgTable("languages", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  nativeName: text("native_name").notNull(),
  flagEmoji: text("flag_emoji").notNull(),
  colorTheme: text("color_theme").notNull(),
  description: text("description").notNull(),
  scriptName: text("script_name").notNull(),
  totalLearners: integer("total_learners").notNull().default(0),
  order: serial("order"),
});

export const insertLanguageSchema = createInsertSchema(languagesTable).omit({ order: true });
export type InsertLanguage = z.infer<typeof insertLanguageSchema>;
export type LanguageRow = typeof languagesTable.$inferSelect;
