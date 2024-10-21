import { NextFunction, Request, Response } from "express";
import BookReview, { IBookReview } from "../../models/Reviews";
import CustomError from "../../config/errors/CustomError";
import {
  deleteImageFromFirebase,
  uploadImageToFirebase,
  verifyrequiredparams,
} from "../../middlewares/common";
import { AuthenticatedRequest } from "../../middlewares/authCheck";
import mongoose from "mongoose";

// Create a new book review
export const createBookReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, author, reviewText, rating } = req.body;
    const userId = (req as AuthenticatedRequest).userId;
    await verifyrequiredparams(req.body, [
      "title",
      "author",
      "reviewText",
      "rating",
    ]);
    console.log("title", title);
    const file = req.file;
    if (!file) throw new CustomError("Please provide a file", 400);
    const result = await uploadImageToFirebase(file, "Novel Folio");
    const imageData = {
      downloadURL: result.downloadURL,
      name: result.name,
      type: result.type,
    };

    const newReview = new BookReview({
      title,
      author,
      reviewText,
      rating,
      user_Id: userId,
      image: imageData,
    });

    const savedReview = await newReview.save();
    res
      .status(201)
      .send({ message: "New Review Created Sucessfully", savedReview });
  } catch (error: any) {
    next(error);
  }
};

// Edit a book review
export const editBookReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  const { title, author, reviewText, rating, reviewId } = req.body;
  const userId = (req as AuthenticatedRequest).userId;
  // Validate review ID
  if (!reviewId) {
    throw new CustomError("No review ID provided", 400);
  }
 
    // Find the review by ID
    const review: any = await BookReview.findById(reviewId);

    if (review?.user_Id.toString() !== userId) {
      // Ensure the user owns the review
      throw new CustomError(
        "You don't have permission to edit this review",
        403
      );
    }

    if (title) review.title = title;
    if (author) review.author = author;
    if (reviewText) review.reviewText = reviewText;
    if (rating) review.rating = rating;
    const file = req.file;
    if (file) {
      let imageData: any = {};
      const result = await uploadImageToFirebase(file, "Novel Folio");
      imageData = {
        downloadURL: result.downloadURL,
        name: result.name,
        type: result.type,
      };
      if (imageData.downloadURL && review.image.downloadURL) {
        await deleteImageFromFirebase(review.image.downloadURL);
      }
      if (imageData) {
        review.image = imageData;
      }
    }
    await review.save();

    res.status(200).send({ message: "Review Updated", review });
  } catch (error: any) {
    throw new CustomError(`${error.message}`, 500);
  }
};

// Delete a book review
export const deleteBookReview = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
  const { reviewId }: IBookReview = req.body;
  // Validate review ID
  if (!reviewId) {
    throw new CustomError("No review ID provided", 400);
  }
  
    await BookReview.findByIdAndDelete(reviewId);
    return res.status(200).send({ message: "Review deleted successfully" });
  } catch (error: any) {
    next(error);
  }
};

// View user's reviews
export const viewUserReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 8;
    let search = req.query.search || "";
    const userId = new mongoose.Types.ObjectId((req as AuthenticatedRequest).userId);
    let query = {
      title: { $regex: search, $options: "i" },
      user_Id: userId,
    };
    const reviewData = await BookReview.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (reviewData.length <= 0) {
      throw new CustomError("No reviews found for this user", 404);
    }
    const total = await BookReview.countDocuments(query);

    const response = {
      totalPages: Math.ceil(total / limit),
      page,
      reviewData,
    };
    res.status(200).send(response);
  } catch (error: any) {
    next(error);
  }
};

// View  reviews
export const viewALLReviews = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = 8;
    let search = req.query.search || "";

    let query = {
      title: { $regex: search, $options: "i" },
    };
    const reviewData = await BookReview.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    if (reviewData.length <= 0) {
      throw new CustomError("No reviews found", 404);
    }

    const total = await BookReview.countDocuments(query);

    const response = {
      totalPages: Math.ceil(total / limit),
      page,
      reviewData,
    };
    res.status(200).send(response);
  } catch (error: any) {
    next(error);
  }
};
