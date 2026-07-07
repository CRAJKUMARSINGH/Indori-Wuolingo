import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, lessonsTable, exercisesTable, usersTable, lessonProgressTable } from "@indori/db";
import {
  GetLessonParams,
  GetLessonResponse,
  CompleteLessonParams,
  CompleteLessonBody,
  CompleteLessonResponse,
} from "@workspace/api-zod";
import {
  clampCorrectCount,
  computeStars,
  computeStreak,
  computeXpEarned,
} from "../lib/progress.js";

const router: IRouter = Router();

router.get("/lessons/:lessonId", async (req, res): Promise<void> => {
  const params = GetLessonParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [lesson] = await db
    .select()
    .from(lessonsTable)
    .where(eq(lessonsTable.id, params.data.lessonId));

  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  const exercises = await db
    .select()
    .from(exercisesTable)
    .where(eq(exercisesTable.lessonId, lesson.id))
    .orderBy(exercisesTable.order);

  res.json(
    GetLessonResponse.parse({
      id: lesson.id,
      unitId: lesson.unitId,
      title: lesson.title,
      order: lesson.order,
      xpReward: lesson.xpReward,
      exercises: exercises.map((e) => ({
        ...e,
        romanization: e.romanization ?? null,
        nativeScript: e.nativeScript ?? null,
      })),
    }),
  );
});

router.post("/lessons/:lessonId/complete", async (req, res): Promise<void> => {
  const params = CompleteLessonParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsedBody = CompleteLessonBody.safeParse(req.body);
  if (!parsedBody.success) {
    res.status(400).json({ error: parsedBody.error.message });
    return;
  }

  const { lessonId } = params.data;
  const { userId, correctCount } = parsedBody.data;

  // Fetch lesson and exercises in parallel — derive totalCount server-side
  const [[lesson], exercises, [user], [existing]] = await Promise.all([
    db.select().from(lessonsTable).where(eq(lessonsTable.id, lessonId)),
    db.select().from(exercisesTable).where(eq(exercisesTable.lessonId, lessonId)),
    db.select().from(usersTable).where(eq(usersTable.id, userId)),
    db
      .select()
      .from(lessonProgressTable)
      .where(
        sql`${lessonProgressTable.userId} = ${userId} AND ${lessonProgressTable.lessonId} = ${lessonId}`,
      ),
  ]);

  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  // Authoritative total from DB; clamp correct count to valid range
  const serverTotal = exercises.length;
  const safeCorrect = clampCorrectCount(correctCount, serverTotal);
  const stars = computeStars(safeCorrect, serverTotal);

  // XP is idempotent: only award on first completion, or when stars improve
  const prevStars = existing?.stars ?? -1;
  const isFirstCompletion = !existing;
  const xpEarned = computeXpEarned({
    isFirstCompletion,
    stars,
    prevStars,
    xpReward: lesson.xpReward,
  });

  const today = new Date().toISOString().slice(0, 10);
  const newStreak = computeStreak({
    lastActiveDate: user.lastActiveDate,
    streak: user.streak,
    today,
  });

  await db
    .insert(lessonProgressTable)
    .values({ userId, lessonId, stars })
    .onConflictDoUpdate({
      target: [lessonProgressTable.userId, lessonProgressTable.lessonId],
      set: {
        stars: sql`greatest(${lessonProgressTable.stars}, excluded.stars)`,
        completedAt: new Date(),
      },
    });

  const [updatedUser] = await db
    .update(usersTable)
    .set({ xp: user.xp + xpEarned, streak: newStreak, lastActiveDate: today })
    .where(eq(usersTable.id, userId))
    .returning();

  res.json(
    CompleteLessonResponse.parse({
      xpEarned,
      stars,
      user: {
        ...updatedUser,
        createdAt: updatedUser.createdAt.toISOString(),
      },
    }),
  );
});

export default router;
