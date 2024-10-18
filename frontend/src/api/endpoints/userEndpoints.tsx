import http from "../../utils/httpClient";
import { AuthData, CustomAxiosRequestConfig } from "./authEndpoints";

//Fetch Authenticated User Profile API endpoint
export const getUserProfile = () =>
  http.get(`/me`, { requireAuthHeader: true } as CustomAxiosRequestConfig);

export const updateUserProfile = (data:AuthData) =>
  http.patch(`/updateUserInformation`,data, { withCredentials: true, requireAuthHeader: true } as CustomAxiosRequestConfig);