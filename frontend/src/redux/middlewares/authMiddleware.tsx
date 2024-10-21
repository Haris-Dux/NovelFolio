import { authUserLogout, addAuthToken } from "../features/auth/authSlice";
import { authStorage } from "../../utils/browserStorage";
import { Middleware } from "@reduxjs/toolkit";


const authMiddleware:Middleware = () => (next) => (action:any) => {
  if (action.type === authUserLogout().type) {
    authStorage.logout();
  } else if (action.type === addAuthToken.type) {
    authStorage.authTkn = action.payload?.token;
  }
  return next(action);
};

export default authMiddleware;
