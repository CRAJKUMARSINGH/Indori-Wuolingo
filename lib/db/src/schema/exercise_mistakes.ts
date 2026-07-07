import { pgTable, serial, integer, timestamp, unique } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { exercisesTable } from "./exercises";

export const exerciseMistakesTable = pgTable("exercise_mistakes", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  exerciseId: integer("exercise_id").notNull().references(() => exercisesTable.id),
  missedCount: integer("missed_count").notNull().default(1),
  lastMissedAt: timestamp("last_missed_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [unique().on(t.userId, t.exerciseId)]);

export const insertExerciseMistakeSchema = createInsertSchema(exerciseMistakesTable).omit({ id: true, missedCount: true, lastMissedAt: true });
export type InsertExerciseMistake = z.infer<typeof insertExerciseMistakeSchema>;
export type ExerciseMistake = typeof exerciseMistakesTable.$inferSelect;
