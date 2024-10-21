import express from "express";
import userRouter from "./user.routes";
import reviewRouter from "./review.routes";
const router = express.Router();


router.use(userRouter);
router.use(reviewRouter);

export default router;
