import http from "../../utils/httpClient";
import { CustomAxiosRequestConfig } from "./authEndpoints";

//Fetch Authenticated User Profile API endpoint
export const getUserProfile = () =>
  http.get(`/me`, { requireAuthHeader: true } as CustomAxiosRequestConfig);
