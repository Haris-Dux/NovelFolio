import express from "express";
import { requireAuthentication } from "../middlewares/authCheck";
import { createBookReview, deleteBookReview, editBookReview, viewALLReviews, viewUserReviews } from "../controllers/Reviews/Reviews.controller";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });
const reviewRouter = express.Router();

//User Routes
reviewRouter
  .post("/reviews/createBookReview",requireAuthentication,upload.single("image"), createBookReview)
  .patch("/reviews/editBookReview",requireAuthentication,upload.single("image"), editBookReview)
  .post("/reviews/deleteBookReview",requireAuthentication, deleteBookReview)
  .get("/reviews/viewUserReviews",requireAuthentication, viewUserReviews)
  .get("/reviews/viewALLReviews", viewALLReviews)

 

export default reviewRouter;
