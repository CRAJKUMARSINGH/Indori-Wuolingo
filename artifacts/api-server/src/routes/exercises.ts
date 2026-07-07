import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db } from "@workspace/db";
import { exerciseMistakesTable } from "@workspace/db";
import {
  RecordMistakeParams,
  RecordMistakeBody,
  MasterExerciseParams,
  MasterExerciseBody,
  RecordMistakeResponse,
  MasterExerciseResponse,
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

  const { exerciseId } = params.data;
  const { userId } = body.data;

  await db
    .insert(exerciseMistakesTable)
    .values({ userId, exerciseId })
    .onConflictDoUpdate({
      target: [exerciseMistakesTable.userId, exerciseMistakesTable.exerciseId],
      set: {
        missedCount: sql`${exerciseMistakesTable.missedCount} + 1`,
        lastMissedAt: new Date(),
      },
    });

  res.json(RecordMistakeResponse.parse({ ok: true }));
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

  const { exerciseId } = params.data;
  const { userId } = body.data;

  await db
    .delete(exerciseMistakesTable)
    .where(
      and(
        eq(exerciseMistakesTable.userId, userId),
        eq(exerciseMistakesTable.exerciseId, exerciseId)
      )
    );

  res.json(MasterExerciseResponse.parse({ ok: true }));
});

export default router;
