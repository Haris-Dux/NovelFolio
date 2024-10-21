import * as API from "../../api";
import { addreview_loading, addReviewData, IBookReview } from "../features/review/reviewSlice";
import { AppDispatch } from "../store";


export function createBookReview(data:IBookReview, callback:(error:string | null,success:string | null) => void) {
  return async function (dispatch:AppDispatch) {
    try {
      const response = await API.createReview(data);
      dispatch(addReviewData(response.data?.savedReview));
      if (callback) {
        callback(null,response.data.message);
      }
    } catch (error:any) {
      // Call callback if exists
      if (callback) {
        callback(error.response.data,null);
      }
    } 
  };
}

export function updateReview(data:IBookReview, callback:(error:string | null,success:string | null) => void) {
  return async function () {
    try {
      const response = await API.updateReview(data);
      if (callback) {
        callback(null,response.data.message);
      }
    } catch (error:any) {
      // Call callback if exists
      if (callback) {
        callback(error.response.data,null);
      }
    } 
  };
}

export function getALLUserReviews(data:IBookReview) {
  return async function (dispatch:AppDispatch) {
    try {
      dispatch(addreview_loading({loading:true}))

      const response = await API.getUserReviews(data);
      dispatch(
        addReviewData({
          reviewData: response.data.reviewData,
          page: response.data.page,
          totalPages: response.data.totalPages,
        })
      );
    
    } catch (error:any) {
     throw new Error(error)
     
    } finally {
      dispatch(addreview_loading({loading:false}))

    }
  };
};

export function deleteUserReviews(data:API.deleteReviewData,callback:(success:string | null) => void) {
  return async function () {
    try {
      const response = await API.deleteUserReviews(data);
    if(callback){
      callback(response?.data?.message);
    }
    } catch (error:any) {
     throw new Error(error)
     
    } 
  };
};


export function getALLReviews(data:IBookReview) {
  return async function (dispatch:AppDispatch) {
    try {
      dispatch(addreview_loading({loading:true}))
      const response = await API.getAllReviews(data);
      dispatch(
        addReviewData({
          reviewData: response.data.reviewData,
          page: response.data.page,
          totalPages: response.data.totalPages,
        })
      );
    
    } catch (error:any) {
     throw new Error(error)
     
    } finally {
      dispatch(addreview_loading({loading:false}))
    }
  };
};

