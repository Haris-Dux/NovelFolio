import { createSlice } from "@reduxjs/toolkit";

export interface IBookReview  {
    id?:string;
    title?: string;
    author?: string;
    reviewText?: string;
    rating?: number; 
    user_Id?: string;
    createdAt?: Date;
    image?:File | null;
    page?:number
    search?:string
    
  }

  export interface reviewState {
    reviews: IBookReview[];
    review_loading: boolean;
    update_loading: boolean;
  }


const initialState:reviewState = {
  reviews: [],
  review_loading: false, 
  update_loading:false
};

const reviewSlice = createSlice({
  name: "reviews",
  initialState,
  reducers: {
   
    addReviewData(state, action) {
      const { reviewData, page, totalPages } = action.payload;

      return {
        ...state,
        reviews: reviewData,
        page,
        totalPages,
      };
    },

    addreview_loading(state, action) {
      const { payload } = action;
      return {
        ...state,
        review_loading: Boolean(payload?.loading),
      };
    },

    
  
  },
});

// Export action creators as named exports
export const {
    addReviewData,
    addreview_loading
} = reviewSlice.actions;

// Export reducer as default export
export default reviewSlice.reducer;
