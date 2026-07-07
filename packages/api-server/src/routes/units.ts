import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import {
  db,
  unitsTable,
  lessonsTable,
  lessonProgressTable,
} from "@indori/db";
import { ListUnitsForLanguageParams, ListUnitsForLanguageResponse } from "@workspace/api-zod";
import { parse } from "../lib/http";

const router: IRouter = Router();

router.get("/languages/:languageId/units/:userId", async (req, res): Promise<void> => {
  const { languageId, userId } = parse(ListUnitsForLanguageParams, req.params);

  const units = await db
    .select()
    .from(unitsTable)
    .where(eq(unitsTable.languageId, languageId))
    .orderBy(unitsTable.order);

  // Fetch all lessons and progress in parallel
  const [allLessons, allProgress] = await Promise.all([
    db
      .select()
      .from(lessonsTable)
      .where(
        eq(
          lessonsTable.unitId,
          // We want lessons for all units in this language — use a subquery approach
          // by fetching all lessons for all unit IDs
          lessonsTable.unitId,
        ),
      )
      .orderBy(lessonsTable.order),
    db.select().from(lessonProgressTable).where(eq(lessonProgressTable.userId, userId)),
  ]);

  const unitIds = new Set(units.map((u) => u.id));
  const relevantLessons = allLessons.filter((l) => unitIds.has(l.unitId));

  const progressMap = new Map(allProgress.map((p) => [p.lessonId, p]));

  const result = units.map((unit) => ({
    ...unit,
    lessons: relevantLessons
      .filter((l) => l.unitId === unit.id)
      .map((l) => {
        const prog = progressMap.get(l.id);
        return {
          ...l,
          completed: !!prog,
          stars: prog?.stars ?? 0,
        };
      }),
  }));

  res.json(ListUnitsForLanguageResponse.parse(result));
});

export default router;
