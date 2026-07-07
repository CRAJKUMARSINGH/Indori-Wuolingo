import { pgTable, serial, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const languagesTable = pgTable("languages", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nativeName: text("native_name").notNull(),
  flagEmoji: text("flag_emoji").notNull(),
  scriptName: text("script_name").notNull(),
  colorHex: text("color_hex").notNull(),
});

export const insertLanguageSchema = createInsertSchema(languagesTable).omit({ id: true });
export type InsertLanguage = z.infer<typeof insertLanguageSchema>;
export type Language = typeof languagesTable.$inferSelect;
