import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { lessonsTable } from "./lessons";

export const exerciseTypeValues = [
  "multiple_choice",
  "translate",
  "match_pairs",
  "fill_blank",
  "script_practice",
] as const;

export const exercisesTable = pgTable("exercises", {
  id: text("id").primaryKey(),
  lessonId: text("lesson_id")
    .notNull()
    .references(() => lessonsTable.id, { onDelete: "cascade" }),
  type: text("type", { enum: exerciseTypeValues }).notNull(),
  prompt: text("prompt").notNull(),
  options: text("options").array().notNull(),
  correctAnswer: text("correct_answer").notNull(),
  romanization: text("romanization"),
  nativeScript: text("native_script"),
  order: integer("order").notNull(),
});

export const insertExerciseSchema = createInsertSchema(exercisesTable);
export type InsertExercise = z.infer<typeof insertExerciseSchema>;
export type ExerciseRow = typeof exercisesTable.$inferSelect;
