import { Router, type IRouter } from "express";
import { eq, sql, and } from "drizzle-orm";
import { db } from "@workspace/db";
import {
  lessonsTable,
  exercisesTable,
  usersTable,
  lessonProgressTable,
} from "@workspace/db";
import {
  GetLessonParams,
  CompleteLessonParams,
  CompleteLessonBody,
  GetLessonResponse,
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
    .orderBy(exercisesTable.id);

  const exercisesWithOptions = exercises.map((e) => ({
    ...e,
    options: e.options ?? [],
    nativeScript: e.nativeScript ?? null,
    romanization: e.romanization ?? null,
  }));

  res.json(
    GetLessonResponse.parse({
      ...lesson,
      exercises: exercisesWithOptions,
    })
  );
});

router.post("/lessons/:lessonId/complete", async (req, res): Promise<void> => {
  const paramsResult = CompleteLessonParams.safeParse(req.params);
  if (!paramsResult.success) {
    res.status(400).json({ error: paramsResult.error.message });
    return;
  }

  const bodyResult = CompleteLessonBody.safeParse(req.body);
  if (!bodyResult.success) {
    res.status(400).json({ error: bodyResult.error.message });
    return;
  }

  const { lessonId } = paramsResult.data;
  const { userId, correctCount } = bodyResult.data;

  const [lesson] = await db
    .select()
    .from(lessonsTable)
    .where(eq(lessonsTable.id, lessonId));
  if (!lesson) {
    res.status(404).json({ error: "Lesson not found" });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  // Server-authoritative: count total exercises from DB
  const [countRow] = await db
    .select({ count: sql<number>`count(*)` })
    .from(exercisesTable)
    .where(eq(exercisesTable.lessonId, lessonId));
  const totalCount = Number(countRow?.count ?? 1);
  const clampedCorrect = Math.max(0, Math.min(correctCount, totalCount));

  // Stars: 3 if perfect, 2 if >=70%, 1 if >=50%, 0 otherwise
  const ratio = totalCount > 0 ? clampedCorrect / totalCount : 0;
  const stars = ratio === 1 ? 3 : ratio >= 0.7 ? 2 : ratio >= 0.5 ? 1 : 0;

  // Idempotent XP: full on first completion, 25% bonus for star improvement, 0 on replay
  const [existingProgress] = await db
    .select()
    .from(lessonProgressTable)
    .where(
      and(
        eq(lessonProgressTable.userId, userId),
        eq(lessonProgressTable.lessonId, lessonId)
      )
    );

  let xpEarned = 0;
  const fullXp = lesson.xpReward;

  if (!existingProgress) {
    xpEarned = fullXp;
    await db.insert(lessonProgressTable).values({
      userId,
      lessonId,
      stars,
      xpEarned,
    });
  } else if (stars > existingProgress.stars) {
    xpEarned = Math.round(fullXp * 0.25);
    await db
      .update(lessonProgressTable)
      .set({ stars, xpEarned: existingProgress.xpEarned + xpEarned })
      .where(eq(lessonProgressTable.id, existingProgress.id));
  }

  // Update user XP and streak
  const today = new Date().toISOString().slice(0, 10);
  const lastActive = user.lastActiveDate;
  let newStreak = user.streak;

  if (lastActive !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    newStreak = lastActive === yesterday ? user.streak + 1 : 1;
  }

  const [updatedUser] = await db
    .update(usersTable)
    .set({
      xp: user.xp + xpEarned,
      streak: newStreak,
      lastActiveDate: today,
    })
    .where(eq(usersTable.id, userId))
    .returning();

  res.json(
    CompleteLessonResponse.parse({
      xpEarned,
      stars,
      streakDays: newStreak,
      totalXp: updatedUser.xp,
    })
  );
});

export default router;
