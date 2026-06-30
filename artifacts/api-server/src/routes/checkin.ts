import { Router } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router = Router();

const MILESTONE_BONUSES: Record<number, number> = {
  7: 25,
  30: 100,
};

function toDateString(d: Date): string {
  return d.toISOString().split("T")[0];
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 86_400_000;
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / msPerDay);
}

router.post("/:id/checkin", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, id));
    if (!user) return res.status(404).json({ error: "User not found" });

    const today = toDateString(new Date());

    if (user.lastActiveDate === today) {
      return res.json({
        user: { ...user, createdAt: user.createdAt.toISOString() },
        streakAction: "already_checked_in",
        bonusXp: 0,
        milestoneReached: null,
      });
    }

    let newStreak: number;
    let streakAction: string;

    if (!user.lastActiveDate) {
      newStreak = 1;
      streakAction = "continued";
    } else {
      const gap = daysBetween(user.lastActiveDate, today);
      if (gap === 1) {
        newStreak = user.streak + 1;
        streakAction = "continued";
      } else {
        newStreak = 1;
        streakAction = "reset";
      }
    }

    let bonusXp = 0;
    let milestoneReached: number | null = null;

    for (const milestone of [30, 7]) {
      if (newStreak === milestone) {
        bonusXp = MILESTONE_BONUSES[milestone];
        milestoneReached = milestone;
        break;
      }
    }

    const [updated] = await db
      .update(usersTable)
      .set({
        streak: newStreak,
        lastActiveDate: today,
        xp: user.xp + bonusXp,
      })
      .where(eq(usersTable.id, id))
      .returning();

    req.log.info(
      { userId: id, streakAction, newStreak, bonusXp, milestoneReached },
      "User checked in"
    );

    res.json({
      user: { ...updated, createdAt: updated.createdAt.toISOString() },
      streakAction,
      bonusXp,
      milestoneReached,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to check in user");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
