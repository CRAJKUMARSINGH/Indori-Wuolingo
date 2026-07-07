import { pgTable, integer, timestamp, uuid, uniqueIndex, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { lessonsTable } from "./lessons";

export const lessonProgressTable = pgTable(
  "lesson_progress",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => lessonsTable.id, { onDelete: "cascade" }),
    stars: integer("stars").notNull().default(0),
    completedAt: timestamp("completed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("lesson_progress_user_lesson_idx").on(table.userId, table.lessonId)],
);

export const insertLessonProgressSchema = createInsertSchema(lessonProgressTable).omit({
  id: true,
  completedAt: true,
});
export type InsertLessonProgress = z.infer<typeof insertLessonProgressSchema>;
export type LessonProgressRow = typeof lessonProgressTable.$inferSelect;
