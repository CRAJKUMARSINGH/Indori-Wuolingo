import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, lessonsTable, exercisesTable, usersTable, lessonProgressTable } from "@indilingo/db";
import {
  GetLessonParams,
  GetLessonResponse,
  CompleteLessonParams,
  CompleteLessonBody,
  CompleteLessonResponse,
} from "@workspace/api-zod";

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

function computeStars(correctCount: number, totalCount: number): number {
  if (totalCount <= 0) return 0;
  const ratio = correctCount / totalCount;
  if (ratio >= 1) return 3;
  if (ratio >= 0.7) return 2;
  if (ratio > 0) return 1;
  return 0;
}

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
  const safeCorrect = Math.min(Math.max(0, correctCount), serverTotal);
  const stars = computeStars(safeCorrect, serverTotal);

  // XP is idempotent: only award on first completion, or when stars improve
  const prevStars = existing?.stars ?? -1;
  const isFirstCompletion = !existing;
  const isImprovedStars = stars > prevStars;
  const xpEarned = isFirstCompletion
    ? stars > 0
      ? lesson.xpReward
      : Math.round(lesson.xpReward / 2)
    : isImprovedStars
      ? Math.round(lesson.xpReward * 0.25) // partial bonus for improvement only
      : 0;

  const today = new Date().toISOString().slice(0, 10);
  const wasActiveYesterday = (() => {
    if (!user.lastActiveDate) return false;
    const diffDays = Math.round(
      (new Date(today).getTime() - new Date(user.lastActiveDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    return diffDays === 1;
  })();
  const wasActiveToday = user.lastActiveDate === today;
  const newStreak = wasActiveToday ? user.streak : wasActiveYesterday ? user.streak + 1 : 1;

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
