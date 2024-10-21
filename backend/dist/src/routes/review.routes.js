"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authCheck_1 = require("../middlewares/authCheck");
const Reviews_controller_1 = require("../controllers/Reviews/Reviews.controller");
const multer_1 = __importDefault(require("multer"));
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
const reviewRouter = express_1.default.Router();
//User Routes
reviewRouter
    .post("/reviews/createBookReview", authCheck_1.requireAuthentication, upload.single("image"), Reviews_controller_1.createBookReview)
    .patch("/reviews/editBookReview", authCheck_1.requireAuthentication, upload.single("image"), Reviews_controller_1.editBookReview)
    .post("/reviews/deleteBookReview", authCheck_1.requireAuthentication, Reviews_controller_1.deleteBookReview)
    .get("/reviews/viewUserReviews", authCheck_1.requireAuthentication, Reviews_controller_1.viewUserReviews)
    .get("/reviews/viewALLReviews", Reviews_controller_1.viewALLReviews);
exports.default = reviewRouter;
