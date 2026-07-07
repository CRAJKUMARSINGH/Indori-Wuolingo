import { Router, type IRouter } from "express";
import { eq, count } from "drizzle-orm";
import { db } from "@workspace/db";
import {
  usersTable,
  lessonProgressTable,
  lessonsTable,
  unitsTable,
  languagesTable,
  exerciseMistakesTable,
  exercisesTable,
} from "@workspace/db";
import {
  CreateUserBody,
  GetUserParams,
  GetUserStatsParams,
  GetReviewQueueParams,
  CreateUserResponse,
  GetUserResponse,
  GetUserStatsResponse,
  GetReviewQueueResponse,
} from "@workspace/api-zod";
import { sql } from "drizzle-orm";

const router: IRouter = Router();

router.post("/users", async (req, res): Promise<void> => {
  const body = CreateUserBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: body.error.message });
    return;
  }

  const [user] = await db
    .insert(usersTable)
    .values({ name: body.data.name })
    .returning();

  res.status(201).json(
    CreateUserResponse.parse({
      ...user,
      lastActiveDate: user.lastActiveDate ?? null,
      createdAt: user.createdAt.toISOString(),
    })
  );
});

router.get("/users/:userId", async (req, res): Promise<void> => {
  const params = GetUserParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [user] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, params.data.userId));

  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json(
    GetUserResponse.parse({
      ...user,
      lastActiveDate: user.lastActiveDate ?? null,
      createdAt: user.createdAt.toISOString(),
    })
  );
});

router.get("/users/:userId/stats", async (req, res): Promise<void> => {
  const params = GetUserStatsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { userId } = params.data;

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  // Per-language progress
  const langs = await db.select().from(languagesTable);

  const languageProgress = await Promise.all(
    langs.map(async (lang) => {
      const units = await db
        .select({ id: unitsTable.id })
        .from(unitsTable)
        .where(eq(unitsTable.languageId, lang.id));
      const unitIds = units.map((u) => u.id);

      if (!unitIds.length) {
        return {
          languageId: lang.id,
          languageName: lang.name,
          nativeName: lang.nativeName,
          flagEmoji: lang.flagEmoji,
          completedLessons: 0,
          totalLessons: 0,
        };
      }

      const allLessons = await db
        .select({ id: lessonsTable.id })
        .from(lessonsTable);
      const langLessons = allLessons.filter((l) => {
        // We need to check if lesson belongs to one of these units
        return true; // will filter via subquery below
      });

      const [totalRow] = await db
        .select({ count: sql<number>`count(*)` })
        .from(lessonsTable)
        .where(sql`${lessonsTable.unitId} = ANY(${unitIds}::int[])`);

      const [completedRow] = await db
        .select({ count: sql<number>`count(*)` })
        .from(lessonProgressTable)
        .where(
          sql`${lessonProgressTable.userId} = ${userId} AND ${lessonProgressTable.lessonId} IN (
            SELECT id FROM lessons WHERE unit_id = ANY(${unitIds}::int[])
          )`
        );

      return {
        languageId: lang.id,
        languageName: lang.name,
        nativeName: lang.nativeName,
        flagEmoji: lang.flagEmoji,
        completedLessons: Number(completedRow?.count ?? 0),
        totalLessons: Number(totalRow?.count ?? 0),
      };
    })
  );

  // Filter languages that have lessons
  const activeProgress = languageProgress.filter((lp) => lp.totalLessons > 0);

  // Badges derived from user data
  const badges = [
    {
      id: "first_steps",
      name: "First Steps",
      description: "Complete your first lesson",
      unlocked: user.xp > 0,
    },
    {
      id: "century_club",
      name: "Century Club",
      description: "Earn 100 XP",
      unlocked: user.xp >= 100,
    },
    {
      id: "on_fire",
      name: "On Fire",
      description: "Reach a 7-day streak",
      unlocked: user.streak >= 7,
    },
    {
      id: "rocket_learner",
      name: "Rocket Learner",
      description: "Earn 500 XP",
      unlocked: user.xp >= 500,
    },
    {
      id: "champion",
      name: "Champion",
      description: "Earn 1000 XP",
      unlocked: user.xp >= 1000,
    },
  ];

  res.json(
    GetUserStatsResponse.parse({
      userId,
      languageProgress: activeProgress,
      badges,
    })
  );
});

router.get("/users/:userId/review", async (req, res): Promise<void> => {
  const params = GetReviewQueueParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const { userId } = params.data;

  const mistakes = await db
    .select()
    .from(exerciseMistakesTable)
    .where(eq(exerciseMistakesTable.userId, userId))
    .orderBy(
      sql`${exerciseMistakesTable.missedCount} DESC, ${exerciseMistakesTable.lastMissedAt} ASC`
    )
    .limit(10);

  if (!mistakes.length) {
    res.json(GetReviewQueueResponse.parse([]));
    return;
  }

  const exerciseIds = mistakes.map((m) => m.exerciseId);
  const exercises = await db
    .select()
    .from(exercisesTable)
    .where(sql`${exercisesTable.id} = ANY(${exerciseIds}::int[])`);

  // Preserve spaced-repetition priority order from mistakes (missedCount DESC, lastMissedAt ASC)
  const exerciseById: Record<number, (typeof exercises)[0]> = {};
  for (const e of exercises) exerciseById[e.id] = e;

  const result = mistakes
    .filter((m) => exerciseById[m.exerciseId])
    .map((m) => {
      const e = exerciseById[m.exerciseId];
      return {
        ...e,
        options: e.options ?? [],
        nativeScript: e.nativeScript ?? null,
        romanization: e.romanization ?? null,
        missedCount: m.missedCount,
      };
    });

  res.json(GetReviewQueueResponse.parse(result));
});

export default router;
