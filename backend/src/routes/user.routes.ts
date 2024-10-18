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
  .post("/login", login)
  .post("/signup", signup)
  .post("/logout", requireAuthentication,logout)
  .patch("/updateUserInformation", requireAuthentication,updateUserInformation)
  .post("/master-logout", requireAuthentication, logoutAllDevices)
  .post("/reauth", refreshAccessToken)
  .get("/me", requireAuthentication, fetchAuthUserProfile)
  .get( "/:id", requireAuthentication,fetchUserProfile);

export default userRouter;
