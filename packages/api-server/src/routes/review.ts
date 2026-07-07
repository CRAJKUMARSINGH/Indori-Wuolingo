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
import { parse, serializeExercise } from "../lib/http";

const router: IRouter = Router();

router.post("/exercises/:exerciseId/mistake", async (req, res): Promise<void> => {
  const { exerciseId } = parse(RecordMistakeParams, req.params);
  const { userId } = parse(RecordMistakeBody, req.body);

  await db
    .insert(exerciseMistakesTable)
    .values({
      userId,
      exerciseId,
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
  const { exerciseId } = parse(MasterExerciseParams, req.params);
  const { userId } = parse(MasterExerciseBody, req.body);

  await db
    .delete(exerciseMistakesTable)
    .where(
      sql`${exerciseMistakesTable.userId} = ${userId} AND ${exerciseMistakesTable.exerciseId} = ${exerciseId}`,
    );

  res.json({ ok: true });
});

router.get("/users/:userId/review", async (req, res): Promise<void> => {
  const { userId } = parse(GetReviewExercisesParams, req.params);

  const mistakes = await db
    .select()
    .from(exerciseMistakesTable)
    .where(eq(exerciseMistakesTable.userId, userId))
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
    GetReviewExercisesResponse.parse(exercises.map(serializeExercise)),
  );
});

export default router;
