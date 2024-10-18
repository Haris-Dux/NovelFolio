import express from "express";
import userRouter from "./user.routes";
import reviewRouter from "./review.routes";
const router = express.Router();


router.use("/users", userRouter);
router.use("/reviews", reviewRouter);

export default router;
