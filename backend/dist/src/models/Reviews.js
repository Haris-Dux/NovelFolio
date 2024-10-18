"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Create the BookReview schema
const BookReviewSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Title is required'],
    },
    author: {
        type: String,
        required: [true, 'Author is required'],
    },
    reviewText: {
        type: String,
        required: [true, 'ReviewText is required'],
    },
    rating: {
        type: Number,
        required: [true, 'Rating is required'],
        min: 1,
        max: 5,
    },
    user_Id: {
        type: mongoose_1.default.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    image: {
        downloadURL: { type: String, required: [true, "image Link required"] },
        name: { type: String },
        type: { type: String },
    },
}, {
    timestamps: true,
});
//SET SCHEMA OPTION
BookReviewSchema.set("toJSON", {
    virtuals: true,
    transform: function (doc, ret, options) {
        const { image, createdAt, user_Id, rating, reviewText, author, title, id: _id } = ret;
        return { image, createdAt, user_Id, rating, reviewText, author, title, id: _id }; // return fields we need
    },
});
const BookReview = mongoose_1.default.model('BookReview', BookReviewSchema);
exports.default = BookReview;
