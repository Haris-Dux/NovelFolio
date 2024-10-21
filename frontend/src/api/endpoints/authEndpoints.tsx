import http from "../../utils/httpClient";
import { AxiosRequestConfig } from 'axios';

// Define the shape of the login and signup data
export interface AuthData {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
};

// Define the shape of the response data if needed
export interface ResponseData {
  token?: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  }; 
}

 export interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  requireAuthHeader?: boolean; 
}

//Login API endpoint
export const login = (data:AuthData) =>
  http.post("/users/login", data, { withCredentials: true });

//Signup API endpoint
export const signup = (data:AuthData) =>
  http.post("/users/signup", data, { withCredentials: true });

// Refresh Token API endpoint
export const refreshAccessToken = () =>
  http("/users/reauth", {
    method: "post",
    withCredentials: true,
  });


//Logout API endpoint
export const logout = ():Promise<ResponseData> =>
  http.post("/users/logout", null, {
    withCredentials: true,
    requireAuthHeader: true,
  } as CustomAxiosRequestConfig);
