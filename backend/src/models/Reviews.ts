

import mongoose, { Document, Schema } from 'mongoose';


export interface IBookReview extends Document {
    reviewId?:string;
  title: string;
  author: string;
  reviewText: string;
  rating: number; 
  user_Id: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  image:{
    downloadURL: string;
    name: string;
    type: string;
  }
}

// Create the BookReview schema
const BookReviewSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true,'Title is required'],
    },
    author: {
      type: String,
      required:  [true,'Author is required'],
    },
    reviewText: {
      type: String,
      required:  [true,'ReviewText is required'],
    },
    rating: {
      type: Number,
      required:  [true,'Rating is required'],
      min: 1,
      max: 5,
    },
    user_Id: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    image: {
        downloadURL: { type: String, required: [true, "image Link required"] },
        name: { type: String },
        type: { type: String },
      },
  },
  {
    timestamps: true,
  }
);

//SET SCHEMA OPTION
BookReviewSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret, options) {
    const { image, createdAt, user_Id,rating,reviewText,author,title,id:_id } = ret;

    return { image, createdAt, user_Id,rating,reviewText,author,title,id:_id }; // return fields we need
  },
});


const BookReview = mongoose.model<IBookReview>('BookReview', BookReviewSchema);

export default BookReview;
