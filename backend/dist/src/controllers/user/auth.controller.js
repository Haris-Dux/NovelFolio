"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.logoutAllDevices = exports.logout = exports.login = exports.signup = void 0;
const common_1 = require("../../middlewares/common");
const User_1 = __importDefault(require("../../models/User"));
const CustomError_1 = __importDefault(require("../../config/errors/CustomError"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const AuthorizationError_1 = __importDefault(require("../../config/errors/AuthorizationError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Top-level constants
const REFRESH_TOKEN = {
    secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
    cookie: {
        name: "refreshTkn",
        options: {
            sameSite: "None",
            secure: true,
            httpOnly: true,
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
    },
};
//SIGN UP USER 
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password } = req.body;
        yield (0, common_1.verifyrequiredparams)(req.body, ['firstName', 'lastName', 'email', 'password',]);
        //check registerd emial
        const emailtocheck = email.toLowerCase();
        const userExists = yield User_1.default.findOne({ email: emailtocheck });
        if (userExists) {
            throw new CustomError_1.default("User already exists", 400);
        }
        /* Custom methods on newUser are defined in User model */
        const newUser = new User_1.default({ firstName, lastName, email, password });
        yield newUser.save(); // Save new User to DB
        const aTkn = newUser.generateAcessToken(); // Create Access Token
        const refreshToken = yield newUser.generateRefreshToken(); // Create Refresh Token
        // SET refresh Token cookie in response
        res.cookie(REFRESH_TOKEN.cookie.name, refreshToken, REFRESH_TOKEN.cookie.options);
        // Send Response on successful Sign Up
        res.status(201).json({
            success: true,
            user: newUser,
            accessToken: aTkn,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.signup = signup;
//LOGIN USER
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        yield (0, common_1.verifyrequiredparams)(req.body, ['email', 'password']);
        //verify email and password
        const user = yield User_1.default.findOne({ email });
        if (!user)
            throw new CustomError_1.default("Wrong credentials!", 400);
        const passwdMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!passwdMatch)
            throw new CustomError_1.default("Wrong credentials!", 400);
        /* Custom methods on user are defined in User model */
        const aTkn = user.generateAcessToken(); // Create Access Token
        const refreshToken = yield user.generateRefreshToken(); // Create Refresh Token
        // SET refresh Token cookie in response
        res.cookie(REFRESH_TOKEN.cookie.name, refreshToken, REFRESH_TOKEN.cookie.options);
        // Send Response on successful Login
        res.json({
            success: true,
            user,
            accessToken: aTkn,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.login = login;
//LOGOUT USER
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Authenticated user ID attached on `req` by authentication middleware
        const userId = req.userId;
        const user = yield User_1.default.findById(userId);
        user.refreshToken = undefined;
        yield user.save();
        // Set cookie expiry option to past date so it is destroyed
        const expireCookieOptions = Object.assign({}, REFRESH_TOKEN.cookie.options, {
            expires: new Date(1),
        });
        // Destroy refresh token cookie with `expireCookieOptions` containing a past date
        res.cookie(REFRESH_TOKEN.cookie.name, "", expireCookieOptions);
        res.status(205).json({
            success: true,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.logout = logout;
//LOGOUT USER FROM ALL DEVICES
const logoutAllDevices = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Authenticated user ID attached on `req` by authentication middleware
        const userId = req.userId;
        const user = yield User_1.default.findById(userId);
        user.refreshToken = "";
        yield user.save();
        // Set cookie expiry to past date to mark for destruction
        const expireCookieOptions = Object.assign({}, REFRESH_TOKEN.cookie.options, {
            expires: new Date(1),
        });
        // Destroy refresh token cookie
        res.cookie(REFRESH_TOKEN.cookie.name, "", expireCookieOptions);
        res.status(205).json({
            success: true,
        });
    }
    catch (error) {
        next(error);
    }
});
exports.logoutAllDevices = logoutAllDevices;
//REGENERATE NEW ACCESS TOKEN
const refreshAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookies = req.cookies;
        const refreshToken = cookies[REFRESH_TOKEN.cookie.name];
        if (!refreshToken) {
            throw new AuthorizationError_1.default("Authentication error!", 401, {
                realm: "Obtain new Access Token",
                error: "no_rft",
                error_description: "Refresh Token is missing!",
            });
        }
        const decodedRefreshTkn = jsonwebtoken_1.default.verify(refreshToken, REFRESH_TOKEN.secret);
        const rTknHash = crypto_1.default
            .createHmac("sha256", REFRESH_TOKEN.secret)
            .update(refreshToken)
            .digest("hex");
        const userWithRefreshTkn = yield User_1.default.findOne({
            _id: decodedRefreshTkn._id,
            "refreshToken": rTknHash,
        });
        if (!userWithRefreshTkn)
            throw new AuthorizationError_1.default("Authentication Error", 401, {
                realm: "Obtain new Access Token",
            });
        // GENERATE NEW ACCESSTOKEN
        const newAtkn = userWithRefreshTkn.generateAcessToken();
        res.status(201);
        res.set({ "Cache-Control": "no-store", Pragma: "no-cache" });
        // Send response with NEW accessToken
        res.json({
            success: true,
            accessToken: newAtkn,
        });
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.name) === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            res.clearCookie(REFRESH_TOKEN.cookie.name),
                next(new AuthorizationError_1.default(error, 401, {
                    realm: "Obtain new Access Token",
                    error_description: "token error",
                }));
            return;
        }
        next(error);
    }
});
exports.refreshAccessToken = refreshAccessToken;
