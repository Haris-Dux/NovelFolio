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
exports.login = exports.signup = void 0;
const common_1 = require("../../middlewares/common");
const User_1 = __importDefault(require("../../models/User"));
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
        /* Custom methods on newUser are defined in User model */
        const newUser = new User_1.default({ firstName, lastName, email, password });
        yield newUser.save(); // Save new User to DB
        const aTkn = yield newUser.generateAcessToken(); // Create Access Token
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
        console.log(error);
        next(error);
    }
});
exports.signup = signup;
//LOGIN USER
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const errors = (0, common_1.verifyrequiredparams)(req);
        const { email, password } = req.body;
        /* Custom methods on user are defined in User model */
        const user = yield User.findByCredentials(email, password); // Identify and retrieve user by credentials
        const aTkn = yield user.generateAcessToken(); // Create Access Token
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
        console.log(error);
        next(error);
    }
});
exports.login = login;
//LOGOUT USER
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Authenticated user ID attached on `req` by authentication middleware
        const userId = req.userId;
        const user = yield User.findById(userId);
        const cookies = req.cookies;
        const refreshToken = cookies[REFRESH_TOKEN.cookie.name];
        // Create a refresh token hash
        const rTknHash = crypto
            .createHmac("sha256", REFRESH_TOKEN.secret)
            .update(refreshToken)
            .digest("hex");
        user.tokens = user.tokens.filter((tokenObj) => tokenObj.token !== rTknHash);
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
        console.log(error);
        next(error);
    }
});
//LOGOUT USER FROM ALL DEVICES
const logoutAllDevices = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Authenticated user ID attached on `req` by authentication middleware
        const userId = req.userId;
        const user = yield User.findById(userId);
        user.tokens = undefined;
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
        console.log(error);
        next(error);
    }
});
//REGENERATE NEW ACCESS TOKEN
const refreshAccessToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookies = req.cookies;
        const refreshToken = cookies[REFRESH_TOKEN.cookie.name];
        if (!refreshToken) {
            throw new AuthorizationError("Authentication error!", undefined, "You are unauthenticated", {
                realm: "Obtain new Access Token",
                error: "no_rft",
                error_description: "Refresh Token is missing!",
            });
        }
        const decodedRefreshTkn = jwt.verify(refreshToken, REFRESH_TOKEN.secret);
        const rTknHash = crypto
            .createHmac("sha256", REFRESH_TOKEN.secret)
            .update(refreshToken)
            .digest("hex");
        const userWithRefreshTkn = yield User.findOne({
            _id: decodedRefreshTkn._id,
            "tokens.token": rTknHash,
        });
        if (!userWithRefreshTkn)
            throw new AuthorizationError("Authentication Error", undefined, "You are unauthenticated!", {
                realm: "Obtain new Access Token",
            });
        // GENERATE NEW ACCESSTOKEN
        const newAtkn = yield userWithRefreshTkn.generateAcessToken();
        res.status(201);
        res.set({ "Cache-Control": "no-store", Pragma: "no-cache" });
        // Send response with NEW accessToken
        res.json({
            success: true,
            accessToken: newAtkn,
        });
    }
    catch (error) {
        if ((error === null || error === void 0 ? void 0 : error.name) === "JsonWebTokenError") {
            next(new AuthorizationError(error, undefined, "You are unauthenticated", {
                realm: "Obtain new Access Token",
                error_description: "token error",
            }));
            return;
        }
        next(error);
    }
});
