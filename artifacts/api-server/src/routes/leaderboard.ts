import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { GetLeaderboardResponse } from "@workspace/api-zod";
import { desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/leaderboard", async (_req, res): Promise<void> => {
  const users = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      xp: usersTable.xp,
      streak: usersTable.streak,
    })
    .from(usersTable)
    .orderBy(desc(usersTable.xp), desc(usersTable.streak))
    .limit(50);

  const entries = users.map((u, i) => ({
    rank: i + 1,
    userId: u.id,
    name: u.name,
    xp: u.xp,
    streak: u.streak,
  }));

  res.json(GetLeaderboardResponse.parse(entries));
});

export default router;
