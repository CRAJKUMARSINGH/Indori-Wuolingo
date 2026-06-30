import { Router } from "express";
import { db } from "@workspace/db";
import { exercisesTable, usersTable, insertExerciseSchema } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateExerciseBody,
  SubmitAnswerBody,
  ListExercisesQueryParams,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const params = ListExercisesQueryParams.safeParse(req.query);
    const lessonId = params.success ? params.data.lessonId : undefined;

    const rows = lessonId
      ? await db.select().from(exercisesTable).where(eq(exercisesTable.lessonId, lessonId))
      : await db.select().from(exercisesTable);

    res.json(rows.map((e) => ({ ...e, options: e.options as string[] })));
  } catch (err) {
    req.log.error({ err }, "Failed to list exercises");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const parsed = CreateExerciseBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

    const [exercise] = await db
      .insert(exercisesTable)
      .values({ ...parsed.data, options: parsed.data.options ?? [] })
      .returning();

    res.status(201).json({ ...exercise, options: exercise.options as string[] });
  } catch (err) {
    req.log.error({ err }, "Failed to create exercise");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/:id/submit", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const parsed = SubmitAnswerBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

    const [exercise] = await db.select().from(exercisesTable).where(eq(exercisesTable.id, id));
    if (!exercise) return res.status(404).json({ error: "Exercise not found" });

    const correct =
      parsed.data.answer.trim().toLowerCase() === exercise.correctAnswer.trim().toLowerCase();

    const xpEarned = correct ? 5 : 0;

    if (correct && parsed.data.userId) {
      const [user] = await db.select().from(usersTable).where(eq(usersTable.id, parsed.data.userId));
      if (user) {
        await db
          .update(usersTable)
          .set({ xp: user.xp + xpEarned })
          .where(eq(usersTable.id, parsed.data.userId));
      }
    }

    res.json({
      correct,
      correctAnswer: exercise.correctAnswer,
      explanation: exercise.explanation,
      xpEarned,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to submit answer");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
