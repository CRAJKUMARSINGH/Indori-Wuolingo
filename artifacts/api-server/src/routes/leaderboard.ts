import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { desc } from "drizzle-orm";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const users = await db
      .select()
      .from(usersTable)
      .orderBy(desc(usersTable.xp))
      .limit(20);

    const leaderboard = users.map((u, i) => ({
      rank: i + 1,
      userId: u.id,
      username: u.username,
      displayName: u.displayName,
      xp: u.xp,
      streak: u.streak,
      avatarUrl: u.avatarUrl,
    }));

    res.json(leaderboard);
  } catch (err) {
    req.log.error({ err }, "Failed to get leaderboard");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
