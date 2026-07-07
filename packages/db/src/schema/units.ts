import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { languagesTable } from "./languages";

export const unitTypeValues = ["script", "vocabulary", "phrases", "conversation"] as const;

export const unitsTable = pgTable("units", {
  id: text("id").primaryKey(),
  languageId: text("language_id")
    .notNull()
    .references(() => languagesTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description").notNull(),
  unitType: text("unit_type", { enum: unitTypeValues }).notNull().default("vocabulary"),
  order: integer("order").notNull(),
});

export const insertUnitSchema = createInsertSchema(unitsTable);
export type InsertUnit = z.infer<typeof insertUnitSchema>;
export type UnitRow = typeof unitsTable.$inferSelect;
