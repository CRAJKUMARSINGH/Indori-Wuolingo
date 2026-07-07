import { Router, type IRouter } from "express";
import { eq, count } from "drizzle-orm";
import {
  db,
  usersTable,
  lessonProgressTable,
  lessonsTable,
  unitsTable,
  languagesTable,
} from "@indori/db";
import {
  CreateUserBody,
  CreateUserResponse,
  GetUserParams,
  GetUserResponse,
  GetUserStatsParams,
  GetUserStatsResponse,
} from "@workspace/api-zod";
import { parse, orNotFound, serializeUser } from "../lib/http";

const router: IRouter = Router();

router.post("/users", async (req, res): Promise<void> => {
  const { name } = parse(CreateUserBody, req.body);

  const [user] = await db
    .insert(usersTable)
    .values({ name })
    .returning();

  res.status(201).json(CreateUserResponse.parse(serializeUser(user)));
});

router.get("/users/:userId", async (req, res): Promise<void> => {
  const { userId } = parse(GetUserParams, req.params);

  const [userRow] = await db
    .select()
    .from(usersTable)
    .where(eq(usersTable.id, userId));

  const user = orNotFound(userRow, "User");

  res.json(GetUserResponse.parse(serializeUser(user)));
});

router.get("/users/:userId/stats", async (req, res): Promise<void> => {
  const { userId } = parse(GetUserStatsParams, req.params);

  const [userRow] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  const user = orNotFound(userRow, "User");

  // Count completed lessons per language
  const completedRows = await db
    .select({
      languageId: languagesTable.id,
      languageName: languagesTable.name,
      lessonsCompleted: count(lessonProgressTable.id),
    })
    .from(lessonProgressTable)
    .innerJoin(lessonsTable, eq(lessonProgressTable.lessonId, lessonsTable.id))
    .innerJoin(unitsTable, eq(lessonsTable.unitId, unitsTable.id))
    .innerJoin(languagesTable, eq(unitsTable.languageId, languagesTable.id))
    .where(eq(lessonProgressTable.userId, userId))
    .groupBy(languagesTable.id, languagesTable.name);

  // Count total lessons per language
  const totalRows = await db
    .select({
      languageId: languagesTable.id,
      languageName: languagesTable.name,
      totalLessons: count(lessonsTable.id),
    })
    .from(lessonsTable)
    .innerJoin(unitsTable, eq(lessonsTable.unitId, unitsTable.id))
    .innerJoin(languagesTable, eq(unitsTable.languageId, languagesTable.id))
    .groupBy(languagesTable.id, languagesTable.name);

  const totalMap = new Map(totalRows.map((r) => [r.languageId, r.totalLessons]));
  const completedMap = new Map(completedRows.map((r) => [r.languageId, r]));

  const languageProgress = totalRows
    .filter((r) => completedMap.has(r.languageId))
    .map((r) => ({
      languageId: r.languageId,
      languageName: r.languageName,
      lessonsCompleted: completedMap.get(r.languageId)?.lessonsCompleted ?? 0,
      totalLessons: totalMap.get(r.languageId) ?? 0,
    }));

  const totalLessonsCompleted = completedRows.reduce(
    (sum, r) => sum + Number(r.lessonsCompleted),
    0,
  );

  // Compute badges
  const badges: string[] = [];
  if (totalLessonsCompleted >= 1) badges.push("First Steps");
  if (user.xp >= 100) badges.push("Century Club");
  if (user.streak >= 7) badges.push("On Fire");
  if (user.xp >= 500) badges.push("Rocket Learner");
  if (user.xp >= 1000) badges.push("Champion");

  res.json(
    GetUserStatsResponse.parse({
      userId,
      totalLessonsCompleted,
      totalXp: user.xp,
      streak: user.streak,
      languageProgress,
      badges,
    }),
  );
});

export default router;
