import express from "express";
import { requireAuthentication } from "../middlewares/authCheck";
import { createBookReview, deleteBookReview, editBookReview, viewALLReviews, viewUserReviews } from "../controllers/Reviews/Reviews.controller";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const reviewRouter = express.Router();

//User Routes
reviewRouter
  .post("/createBookReview",requireAuthentication,upload.single("filename"), createBookReview)
  .patch("/editBookReview",requireAuthentication,upload.single("filename"), editBookReview)
  .delete("/deleteBookReview",requireAuthentication, deleteBookReview)
  .get("/viewUserReviews",requireAuthentication, viewUserReviews)
  .get("/viewALLReviews",requireAuthentication, viewALLReviews)

 

export default reviewRouter;
