import { Router, type IRouter } from "express";
import healthRouter from "./health";
import languagesRouter from "./languages";
import unitsRouter from "./units";
import lessonsRouter from "./lessons";
import usersRouter from "./users";
import leaderboardRouter from "./leaderboard";
import reviewRouter from "./review";

const router: IRouter = Router();

router.use(healthRouter);
router.use(languagesRouter);
router.use(unitsRouter);
router.use(lessonsRouter);
router.use(usersRouter);
router.use(leaderboardRouter);
router.use(reviewRouter);

export default router;
