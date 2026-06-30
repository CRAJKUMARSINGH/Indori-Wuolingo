import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable, lessonsTable, progressTable } from "@workspace/db";
import { eq, gt, sql, count, avg } from "drizzle-orm";

const router = Router();

router.get("/overview", async (req, res) => {
  try {
    const [[totalUsers], [totalLessons], [completions], [avgXpRow], [activeStreaks]] =
      await Promise.all([
        db.select({ count: count() }).from(usersTable),
        db.select({ count: count() }).from(lessonsTable),
        db
          .select({ count: count() })
          .from(progressTable)
          .where(eq(progressTable.completed, true)),
        db.select({ avg: avg(usersTable.xp) }).from(usersTable),
        db
          .select({ count: count() })
          .from(usersTable)
          .where(gt(usersTable.streak, 0)),
      ]);

    res.json({
      totalUsers: totalUsers.count,
      totalLessons: totalLessons.count,
      totalCompletions: completions.count,
      avgXp: Math.round(Number(avgXpRow.avg) || 0),
      activeStreaks: activeStreaks.count,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get stats overview");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/unit-progress", async (req, res) => {
  try {
    const lessons = await db.select().from(lessonsTable).orderBy(lessonsTable.unitNumber);
    const completions = await db
      .select()
      .from(progressTable)
      .where(eq(progressTable.completed, true));

    const completedLessonIds = new Set(completions.map((c) => c.lessonId));

    const unitMap = new Map<
      number,
      { unit: string; unitNumber: number; totalLessons: number; completedLessons: number }
    >();

    for (const lesson of lessons) {
      if (!unitMap.has(lesson.unitNumber)) {
        unitMap.set(lesson.unitNumber, {
          unit: lesson.unit,
          unitNumber: lesson.unitNumber,
          totalLessons: 0,
          completedLessons: 0,
        });
      }
      const entry = unitMap.get(lesson.unitNumber)!;
      entry.totalLessons++;
      if (completedLessonIds.has(lesson.id)) {
        entry.completedLessons++;
      }
    }

    res.json(Array.from(unitMap.values()).sort((a, b) => a.unitNumber - b.unitNumber));
  } catch (err) {
    req.log.error({ err }, "Failed to get unit progress");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
