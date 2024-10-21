"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewALLReviews = exports.viewUserReviews = exports.deleteBookReview = exports.editBookReview = exports.createBookReview = void 0;
const Reviews_1 = __importDefault(require("../../models/Reviews"));
const CustomError_1 = __importDefault(require("../../config/errors/CustomError"));
const common_1 = require("../../middlewares/common");
const mongoose_1 = __importDefault(require("mongoose"));
// Create a new book review
const createBookReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, author, reviewText, rating } = req.body;
        const userId = req.userId;
        yield (0, common_1.verifyrequiredparams)(req.body, [
            "title",
            "author",
            "reviewText",
            "rating",
        ]);
        console.log("title", title);
        const file = req.file;
        if (!file)
            throw new CustomError_1.default("Please provide a file", 400);
        const result = yield (0, common_1.uploadImageToFirebase)(file, "Novel Folio");
        const imageData = {
            downloadURL: result.downloadURL,
            name: result.name,
            type: result.type,
        };
        const newReview = new Reviews_1.default({
            title,
            author,
            reviewText,
            rating,
            user_Id: userId,
            image: imageData,
        });
        const savedReview = yield newReview.save();
        res
            .status(201)
            .send({ message: "New Review Created Sucessfully", savedReview });
    }
    catch (error) {
        next(error);
    }
});
exports.createBookReview = createBookReview;
// Edit a book review
const editBookReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, author, reviewText, rating, reviewId } = req.body;
        const userId = req.userId;
        // Validate review ID
        if (!reviewId) {
            throw new CustomError_1.default("No review ID provided", 400);
        }
        // Find the review by ID
        const review = yield Reviews_1.default.findById(reviewId);
        if ((review === null || review === void 0 ? void 0 : review.user_Id.toString()) !== userId) {
            // Ensure the user owns the review
            throw new CustomError_1.default("You don't have permission to edit this review", 403);
        }
        if (title)
            review.title = title;
        if (author)
            review.author = author;
        if (reviewText)
            review.reviewText = reviewText;
        if (rating)
            review.rating = rating;
        const file = req.file;
        if (file) {
            let imageData = {};
            const result = yield (0, common_1.uploadImageToFirebase)(file, "Novel Folio");
            imageData = {
                downloadURL: result.downloadURL,
                name: result.name,
                type: result.type,
            };
            if (imageData.downloadURL && review.image.downloadURL) {
                yield (0, common_1.deleteImageFromFirebase)(review.image.downloadURL);
            }
            if (imageData) {
                review.image = imageData;
            }
        }
        yield review.save();
        res.status(200).send({ message: "Review Updated", review });
    }
    catch (error) {
        throw new CustomError_1.default(`${error.message}`, 500);
    }
});
exports.editBookReview = editBookReview;
// Delete a book review
const deleteBookReview = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { reviewId } = req.body;
        // Validate review ID
        if (!reviewId) {
            throw new CustomError_1.default("No review ID provided", 400);
        }
        yield Reviews_1.default.findByIdAndDelete(reviewId);
        return res.status(200).send({ message: "Review deleted successfully" });
    }
    catch (error) {
        next(error);
    }
});
exports.deleteBookReview = deleteBookReview;
// View user's reviews
const viewUserReviews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 8;
        let search = req.query.search || "";
        const userId = new mongoose_1.default.Types.ObjectId(req.userId);
        let query = {
            title: { $regex: search, $options: "i" },
            user_Id: userId,
        };
        const reviewData = yield Reviews_1.default.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });
        if (reviewData.length <= 0) {
            throw new CustomError_1.default("No reviews found for this user", 404);
        }
        const total = yield Reviews_1.default.countDocuments(query);
        const response = {
            totalPages: Math.ceil(total / limit),
            page,
            reviewData,
        };
        res.status(200).send(response);
    }
    catch (error) {
        next(error);
    }
});
exports.viewUserReviews = viewUserReviews;
// View  reviews
const viewALLReviews = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = 8;
        let search = req.query.search || "";
        let query = {
            title: { $regex: search, $options: "i" },
        };
        const reviewData = yield Reviews_1.default.find(query)
            .skip((page - 1) * limit)
            .limit(limit)
            .sort({ createdAt: -1 });
        if (reviewData.length <= 0) {
            throw new CustomError_1.default("No reviews found", 404);
        }
        const total = yield Reviews_1.default.countDocuments(query);
        const response = {
            totalPages: Math.ceil(total / limit),
            page,
            reviewData,
        };
        res.status(200).send(response);
    }
    catch (error) {
        next(error);
    }
});
exports.viewALLReviews = viewALLReviews;
