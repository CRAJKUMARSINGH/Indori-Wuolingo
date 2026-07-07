import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db } from "@workspace/db";
import { languagesTable, unitsTable, lessonsTable, lessonProgressTable } from "@workspace/db";
import {
  GetLanguageUnitsParams,
  GetUserLanguageUnitsParams,
  ListLanguagesResponse,
  GetLanguageUnitsResponse,
  GetUserLanguageUnitsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/languages", async (_req, res): Promise<void> => {
  const langs = await db.select().from(languagesTable).orderBy(languagesTable.id);
  res.json(ListLanguagesResponse.parse(langs));
});

router.get("/languages/:languageId/units", async (req, res): Promise<void> => {
  const params = GetLanguageUnitsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const units = await db
    .select()
    .from(unitsTable)
    .where(eq(unitsTable.languageId, params.data.languageId))
    .orderBy(unitsTable.orderIndex);

  if (!units.length) {
    res.status(404).json({ error: "Language not found or has no units" });
    return;
  }

  const lessons = await db
    .select()
    .from(lessonsTable)
    .where(
      eq(
        lessonsTable.unitId,
        db
          .select({ id: unitsTable.id })
          .from(unitsTable)
          .where(eq(unitsTable.languageId, params.data.languageId))
          .limit(1)
          .$dynamic()
          .$dynamic()
          .as("u").id as unknown as number
      )
    );

  // Attach lessons to units without user progress
  const unitIds = units.map((u) => u.id);
  const allLessons = await db
    .select()
    .from(lessonsTable)
    .orderBy(lessonsTable.orderIndex);

  const lessonsByUnit: Record<number, typeof allLessons> = {};
  for (const l of allLessons) {
    if (unitIds.includes(l.unitId)) {
      if (!lessonsByUnit[l.unitId]) lessonsByUnit[l.unitId] = [];
      lessonsByUnit[l.unitId].push(l);
    }
  }

  const result = units.map((unit) => {
    const unitLessons = (lessonsByUnit[unit.id] ?? []).map((l) => ({
      id: l.id,
      unitId: l.unitId,
      title: l.title,
      orderIndex: l.orderIndex,
      xpReward: l.xpReward,
      stars: null,
      completed: false,
    }));
    return {
      ...unit,
      lessons: unitLessons,
      completedLessons: 0,
      totalLessons: unitLessons.length,
    };
  });

  res.json(GetLanguageUnitsResponse.parse(result));
});

router.get("/users/:userId/languages/:languageId/units", async (req, res): Promise<void> => {
  const params = GetUserLanguageUnitsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { userId, languageId } = params.data;

  const units = await db
    .select()
    .from(unitsTable)
    .where(eq(unitsTable.languageId, languageId))
    .orderBy(unitsTable.orderIndex);

  if (!units.length) {
    res.status(404).json({ error: "Language not found or has no units" });
    return;
  }

  const unitIds = units.map((u) => u.id);

  const allLessons = await db
    .select()
    .from(lessonsTable)
    .orderBy(lessonsTable.orderIndex);

  const relevantLessons = allLessons.filter((l) => unitIds.includes(l.unitId));
  const lessonIds = relevantLessons.map((l) => l.id);

  // Get user progress for all these lessons
  const progress = lessonIds.length
    ? await db
        .select()
        .from(lessonProgressTable)
        .where(eq(lessonProgressTable.userId, userId))
    : [];

  const progressByLesson: Record<number, (typeof progress)[0]> = {};
  for (const p of progress) {
    if (lessonIds.includes(p.lessonId)) {
      progressByLesson[p.lessonId] = p;
    }
  }

  const lessonsByUnit: Record<number, typeof relevantLessons> = {};
  for (const l of relevantLessons) {
    if (!lessonsByUnit[l.unitId]) lessonsByUnit[l.unitId] = [];
    lessonsByUnit[l.unitId].push(l);
  }

  const result = units.map((unit) => {
    const unitLessons = (lessonsByUnit[unit.id] ?? []).map((l) => {
      const prog = progressByLesson[l.id];
      return {
        id: l.id,
        unitId: l.unitId,
        title: l.title,
        orderIndex: l.orderIndex,
        xpReward: l.xpReward,
        stars: prog ? prog.stars : null,
        completed: !!prog,
      };
    });
    return {
      ...unit,
      lessons: unitLessons,
      completedLessons: unitLessons.filter((l) => l.completed).length,
      totalLessons: unitLessons.length,
    };
  });

  res.json(GetUserLanguageUnitsResponse.parse(result));
});

export default router;
