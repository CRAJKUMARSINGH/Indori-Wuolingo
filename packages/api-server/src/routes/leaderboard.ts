import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, usersTable } from "@indilingo/db";
import { GetLeaderboardResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/leaderboard", async (req, res): Promise<void> => {
  const users = await db
    .select()
    .from(usersTable)
    .orderBy(desc(usersTable.xp))
    .limit(20);

  const entries = users.map((u, idx) => ({
    userId: u.id,
    name: u.name,
    xp: u.xp,
    rank: idx + 1,
  }));

  res.json(GetLeaderboardResponse.parse(entries));
});

export default router;
