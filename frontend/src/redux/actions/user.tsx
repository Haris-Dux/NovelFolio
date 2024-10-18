import * as API from "../../api";
import {
  addAuthUser,
  authUserLoading,
  updateUserLoading,
} from "../features/auth/authSlice";
import { AppDispatch } from "../store";

export function getUserProfile() {
  return async function (dispatch: AppDispatch) {
    try {
      dispatch(authUserLoading({ loading: true }));
      const response = await API.getUserProfile();

      const user = response.data?.user;

      // Add authenticated user to redux store
      dispatch(addAuthUser({ user }));
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(authUserLoading({ loading: false }));
    }
  };
}

export function updateUserProfile(
  data: API.AuthData,
  callback: (error: string | null, success: string | null) => void
) {
  return async function (dispatch: AppDispatch) {
    try {
      dispatch(updateUserLoading({ loading: true }));
      const response = await API.updateUserProfile(data);
      const user = response.data?.updatedUser;
      console.log('user',user);
      // Add authenticated user to redux store
      dispatch(addAuthUser({ user }));
      if (callback) {
        callback(null, response?.data.message);
      }
    } catch (error: any) {
      if (callback) {
        callback(error.response?.data, null);
      }
    } finally {
      dispatch(updateUserLoading({ loading: false }));
    }
  };
}
