import { Router, type IRouter } from "express";
import healthRouter from "./health";
import languagesRouter from "./languages";
import lessonsRouter from "./lessons";
import usersRouter from "./users";
import leaderboardRouter from "./leaderboard";
import exercisesRouter from "./exercises";

const router: IRouter = Router();

router.use(healthRouter);
router.use(languagesRouter);
router.use(lessonsRouter);
router.use(usersRouter);
router.use(leaderboardRouter);
router.use(exercisesRouter);

export default router;
