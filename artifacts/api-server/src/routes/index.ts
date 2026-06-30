import { Router, type IRouter } from "express";
import healthRouter from "./health";
import lessonsRouter from "./lessons";
import exercisesRouter from "./exercises";
import usersRouter from "./users";
import leaderboardRouter from "./leaderboard";
import progressRouter from "./progress";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use("/lessons", lessonsRouter);
router.use("/exercises", exercisesRouter);
router.use("/users", usersRouter);
router.use("/leaderboard", leaderboardRouter);
router.use("/progress", progressRouter);
router.use("/stats", statsRouter);

export default router;
