import { Router, type IRouter } from "express";
import { eq, desc, asc } from "drizzle-orm";
import { db, exerciseMistakesTable, exercisesTable } from "@indori/db";
import {
  RecordMistakeParams,
  RecordMistakeBody,
  MasterExerciseParams,
  MasterExerciseBody,
  GetReviewExercisesParams,
  GetReviewExercisesResponse,
} from "@workspace/api-zod";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.post("/exercises/:exerciseId/mistake", async (req, res): Promise<void> => {
  const params = RecordMistakeParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = RecordMistakeBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  await db
    .insert(exerciseMistakesTable)
    .values({
      userId: body.data.userId,
      exerciseId: params.data.exerciseId,
      missedCount: 1,
    })
    .onConflictDoUpdate({
      target: [exerciseMistakesTable.userId, exerciseMistakesTable.exerciseId],
      set: {
        missedCount: sql`${exerciseMistakesTable.missedCount} + 1`,
        lastMissedAt: new Date(),
      },
    });

  res.json({ ok: true });
});

router.post("/exercises/:exerciseId/master", async (req, res): Promise<void> => {
  const params = MasterExerciseParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const body = MasterExerciseBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  await db
    .delete(exerciseMistakesTable)
    .where(
      sql`${exerciseMistakesTable.userId} = ${body.data.userId} AND ${exerciseMistakesTable.exerciseId} = ${params.data.exerciseId}`,
    );

  res.json({ ok: true });
});

router.get("/users/:userId/review", async (req, res): Promise<void> => {
  const params = GetReviewExercisesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const mistakes = await db
    .select()
    .from(exerciseMistakesTable)
    .where(eq(exerciseMistakesTable.userId, params.data.userId))
    .orderBy(desc(exerciseMistakesTable.missedCount), asc(exerciseMistakesTable.lastMissedAt))
    .limit(10);

  if (mistakes.length === 0) {
    res.json([]);
    return;
  }

  const exerciseIds = mistakes.map((m) => m.exerciseId);
  const exercises = await db
    .select()
    .from(exercisesTable)
    .where(sql`${exercisesTable.id} = ANY(${exerciseIds})`);

  res.json(
    GetReviewExercisesResponse.parse(
      exercises.map((e) => ({
        ...e,
        romanization: e.romanization ?? null,
        nativeScript: e.nativeScript ?? null,
      })),
    ),
  );
});

export default router;
