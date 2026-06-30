import { Router } from "express";
import { db } from "@workspace/db";
import { progressTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { ListProgressQueryParams, UpdateProgressBody } from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const params = ListProgressQueryParams.safeParse(req.query);
    const userId = params.success ? params.data.userId : undefined;

    const rows = userId
      ? await db.select().from(progressTable).where(eq(progressTable.userId, userId))
      : await db.select().from(progressTable);

    res.json(
      rows.map((p) => ({
        ...p,
        completedAt: p.completedAt ? p.completedAt.toISOString() : null,
      }))
    );
  } catch (err) {
    req.log.error({ err }, "Failed to list progress");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const parsed = UpdateProgressBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

    const existing = await db
      .select()
      .from(progressTable)
      .where(eq(progressTable.userId, parsed.data.userId))
      .then((rows) => rows.find((r) => r.lessonId === parsed.data.lessonId));

    let row;
    if (existing) {
      [row] = await db
        .update(progressTable)
        .set({
          completed: parsed.data.completed,
          xpEarned: parsed.data.xpEarned,
          completedAt: parsed.data.completed ? new Date() : existing.completedAt,
        })
        .where(eq(progressTable.id, existing.id))
        .returning();
    } else {
      [row] = await db
        .insert(progressTable)
        .values({
          ...parsed.data,
          completedAt: parsed.data.completed ? new Date() : null,
        })
        .returning();
    }

    res.json({
      ...row,
      completedAt: row.completedAt ? row.completedAt.toISOString() : null,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to update progress");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
