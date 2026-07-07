import { pgTable, serial, text, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { languagesTable } from "./languages";

export const unitTypeEnum = pgEnum("unit_type", ["script", "vocabulary", "phrases", "conversation"]);

export const unitsTable = pgTable("units", {
  id: serial("id").primaryKey(),
  languageId: integer("language_id").notNull().references(() => languagesTable.id),
  title: text("title").notNull(),
  description: text("description").notNull(),
  orderIndex: integer("order_index").notNull(),
  unitType: unitTypeEnum("unit_type").notNull().default("vocabulary"),
});

export const insertUnitSchema = createInsertSchema(unitsTable).omit({ id: true });
export type InsertUnit = z.infer<typeof insertUnitSchema>;
export type Unit = typeof unitsTable.$inferSelect;
