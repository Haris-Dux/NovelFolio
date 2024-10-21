import { IBookReview } from "../../redux/features/review/reviewSlice";
import http from "../../utils/httpClient";
import { CustomAxiosRequestConfig } from "./authEndpoints";

export interface deleteReviewData {
  reviewId: string | {};
}


export const createReview = (data:IBookReview) =>
  http.post(`/reviews/createBookReview`,data, { withCredentials: true, requireAuthHeader: true} as CustomAxiosRequestConfig);

export const getUserReviews = (data:IBookReview) =>
  http.get(`/reviews/viewUserReviews`,{ params: data, withCredentials: true, requireAuthHeader: true} as CustomAxiosRequestConfig);

export const deleteUserReviews = (data:deleteReviewData) =>
  http.post(`/reviews/deleteBookReview`,data, { withCredentials: true, requireAuthHeader: true} as CustomAxiosRequestConfig);

export const updateReview = (data:IBookReview) =>
  http.patch(`/reviews/editBookReview`,data, { withCredentials: true, requireAuthHeader: true} as CustomAxiosRequestConfig);

export const getAllReviews = (data:IBookReview) =>
  http.get(`/reviews/viewALLReviews`, {params: data, withCredentials: true} as CustomAxiosRequestConfig);