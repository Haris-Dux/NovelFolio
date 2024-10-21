import express from "express";
import {
  login,
  logout,
  logoutAllDevices,
  refreshAccessToken,
  signup,
} from "../controllers/user/auth.controller";
import { requireAuthentication } from "../middlewares/authCheck";
import {
  fetchAuthUserProfile,
  fetchUserProfile,
  updateUserInformation,
} from "../controllers/user/user.controller";

const userRouter = express.Router();

//User Routes
userRouter
  .post("/users/login", login)
  .post("/users/signup", signup)
  .post("/users/logout", requireAuthentication,logout)
  .patch("/users/updateUserInformation", requireAuthentication,updateUserInformation)
  .post("/users/master-logout", requireAuthentication, logoutAllDevices)
  .post("/users/reauth", refreshAccessToken)
  .get("/users/me", requireAuthentication, fetchAuthUserProfile)
  .get( "/users/:id", requireAuthentication,fetchUserProfile);

export default userRouter;
