"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/user/auth.controller");
const authCheck_1 = require("../middlewares/authCheck");
const user_controller_1 = require("../controllers/user/user.controller");
const userRouter = express_1.default.Router();
//User Routes
userRouter
    .post("/users/login", auth_controller_1.login)
    .post("/users/signup", auth_controller_1.signup)
    .post("/users/logout", authCheck_1.requireAuthentication, auth_controller_1.logout)
    .patch("/users/updateUserInformation", authCheck_1.requireAuthentication, user_controller_1.updateUserInformation)
    .post("/users/master-logout", authCheck_1.requireAuthentication, auth_controller_1.logoutAllDevices)
    .post("/users/reauth", auth_controller_1.refreshAccessToken)
    .get("/users/me", authCheck_1.requireAuthentication, user_controller_1.fetchAuthUserProfile)
    .get("/users/:id", authCheck_1.requireAuthentication, user_controller_1.fetchUserProfile);
exports.default = userRouter;
