import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { unitsTable } from "./units";

export const lessonsTable = pgTable("lessons", {
  id: text("id").primaryKey(),
  unitId: text("unit_id")
    .notNull()
    .references(() => unitsTable.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  order: integer("order").notNull(),
  xpReward: integer("xp_reward").notNull().default(10),
});

export const insertLessonSchema = createInsertSchema(lessonsTable);
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type LessonRow = typeof lessonsTable.$inferSelect;
