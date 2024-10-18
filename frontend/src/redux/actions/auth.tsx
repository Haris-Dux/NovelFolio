import toast from "react-hot-toast";
import * as API from "../../api";
import {
  addAuthToken,
  authTokenLoading,
  authUserLoading,
  authUserLogout,
} from "../features/auth/authSlice";
import { AppDispatch } from "../store";
import { getUserProfile } from "./user";



export function login(data:API.AuthData, callback: (error: string | null) => void) {
  return async function (dispatch:AppDispatch) {
    try {
      dispatch(authUserLoading({ loading: true }));

      const response = await API.login(data);
      const accessToken = response.data?.accessToken || response.data?.token;

      // Add the retrieved Access Token to redux store
      dispatch(addAuthToken({ token: accessToken }));
      // Load the user profile (will use the access token in redux store)
      dispatch(getUserProfile());
    } catch (error:any) {

      // Call callback if exists
      if (callback as any) {
        callback(error.response.data);
      }
    } finally {
      dispatch(authUserLoading({ loading: false }));
    }
  };
}

export function signup(data:API.AuthData, callback:(error:string | null) => void) {
  return async function (dispatch:AppDispatch) {
    try {
      dispatch(authUserLoading({ loading: true }));

      const response = await API.signup(data);
      const { accessToken } = response.data;

      dispatch(addAuthToken({ token: accessToken }));
      dispatch(getUserProfile());
    } catch (error:any) {
      console.error(error.response.data);

      // Call callback if exists
      if (callback) {
        callback(error.response.data);
      }
    } finally {
      dispatch(authUserLoading({ loading: false }));
    }
  };
}

export function refreshAccessToken() {
  return async function (dispatch:AppDispatch) {
    try {
      dispatch(authTokenLoading({ loading: true }));
      const response:any = await API.refreshAccessToken();
      const { accessToken } = response.data;

      dispatch(addAuthToken({ token: accessToken }));
    } catch (error) {
      dispatch(authUserLogout());
      console.error(error);
    } finally {
      dispatch(authTokenLoading({ loading: false }));
    }
  };
}

export function logout() {
  return async function (dispatch: AppDispatch) {
    try {
      await API.logout();
      dispatch(authUserLogout());
    } catch (error:any) {
     toast.error(error.response.data)
    }
  };
}

