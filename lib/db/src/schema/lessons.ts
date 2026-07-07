import { pgTable, serial, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { unitsTable } from "./units";

export const lessonsTable = pgTable("lessons", {
  id: serial("id").primaryKey(),
  unitId: integer("unit_id").notNull().references(() => unitsTable.id),
  title: text("title").notNull(),
  orderIndex: integer("order_index").notNull(),
  xpReward: integer("xp_reward").notNull().default(10),
});

export const insertLessonSchema = createInsertSchema(lessonsTable).omit({ id: true });
export type InsertLesson = z.infer<typeof insertLessonSchema>;
export type Lesson = typeof lessonsTable.$inferSelect;
