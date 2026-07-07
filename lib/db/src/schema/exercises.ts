import { pgTable, serial, text, integer, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { lessonsTable } from "./lessons";

export const exerciseTypeEnum = pgEnum("exercise_type", [
  "script_practice",
  "multiple_choice",
  "translate",
  "fill_blank",
  "match_pairs",
]);

export const exercisesTable = pgTable("exercises", {
  id: serial("id").primaryKey(),
  lessonId: integer("lesson_id").notNull().references(() => lessonsTable.id),
  type: exerciseTypeEnum("type").notNull(),
  question: text("question").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  options: text("options").array().notNull().default([]),
  nativeScript: text("native_script"),
  romanization: text("romanization"),
});

export const insertExerciseSchema = createInsertSchema(exercisesTable).omit({ id: true });
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type Exercise = typeof exercisesTable.$inferSelect;
