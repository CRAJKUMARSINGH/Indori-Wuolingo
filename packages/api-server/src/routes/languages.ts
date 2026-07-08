import { Router, type IRouter } from "express";
import { db, languagesTable } from "@indilingo/db";
import { ListLanguagesResponse } from "@workspace/api-zod";
import { asc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/languages", async (req, res): Promise<void> => {
  const langs = await db
    .select()
    .from(languagesTable)
    .orderBy(asc(languagesTable.order));

  res.json(ListLanguagesResponse.parse(langs));
});

export default router;
