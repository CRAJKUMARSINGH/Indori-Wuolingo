import { Router } from "express";
import { db } from "@workspace/db";
import { lessonsTable, exercisesTable, insertLessonSchema } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import {
  ListLessonsResponseItem,
  LessonDetail,
  LessonInput,
  CreateLessonBody,
} from "@workspace/api-zod";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const lessons = await db
      .select({
        id: lessonsTable.id,
        title: lessonsTable.title,
        description: lessonsTable.description,
        unit: lessonsTable.unit,
        unitNumber: lessonsTable.unitNumber,
        order: lessonsTable.order,
        xpReward: lessonsTable.xpReward,
        icon: lessonsTable.icon,
        totalExercises: sql<number>`(SELECT COUNT(*) FROM exercises WHERE exercises.lesson_id = ${lessonsTable.id})`.mapWith(Number),
      })
      .from(lessonsTable)
      .orderBy(lessonsTable.unitNumber, lessonsTable.order);

    res.json(lessons);
  } catch (err) {
    req.log.error({ err }, "Failed to list lessons");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid id" });

    const [lesson] = await db.select().from(lessonsTable).where(eq(lessonsTable.id, id));
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    const exercises = await db.select().from(exercisesTable).where(eq(exercisesTable.lessonId, id));

    res.json({
      ...lesson,
      exercises: exercises.map((e) => ({
        ...e,
        options: e.options as string[],
      })),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get lesson");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const parsed = CreateLessonBody.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.message });

    const [lesson] = await db.insert(lessonsTable).values(parsed.data).returning();
    res.status(201).json({ ...lesson, totalExercises: 0 });
  } catch (err) {
    req.log.error({ err }, "Failed to create lesson");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
