import { pgTable, serial, integer, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { lessonsTable } from "./lessons";

export const lessonProgressTable = pgTable("lesson_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  lessonId: integer("lesson_id").notNull().references(() => lessonsTable.id),
  stars: integer("stars").notNull().default(0),
  xpEarned: integer("xp_earned").notNull().default(0),
  completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [unique().on(t.userId, t.lessonId)]);

export const insertLessonProgressSchema = createInsertSchema(lessonProgressTable).omit({ id: true, completedAt: true });
export type InsertLessonProgress = z.infer<typeof insertLessonProgressSchema>;
export type LessonProgress = typeof lessonProgressTable.$inferSelect;
