import { pgTable, text, integer, timestamp, uuid, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { exercisesTable } from "./exercises";

export const exerciseMistakesTable = pgTable(
  "exercise_mistakes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    exerciseId: text("exercise_id")
      .notNull()
      .references(() => exercisesTable.id, { onDelete: "cascade" }),
    missedCount: integer("missed_count").notNull().default(1),
    lastMissedAt: timestamp("last_missed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [uniqueIndex("exercise_mistakes_user_exercise_idx").on(table.userId, table.exerciseId)],
);

export const insertExerciseMistakeSchema = createInsertSchema(exerciseMistakesTable).omit({
  id: true,
  lastMissedAt: true,
});
export type InsertExerciseMistake = z.infer<typeof insertExerciseMistakeSchema>;
export type ExerciseMistakeRow = typeof exerciseMistakesTable.$inferSelect;
