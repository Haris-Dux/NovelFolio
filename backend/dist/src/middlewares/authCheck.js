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
exports.requireAuthentication = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AuthorizationError_1 = __importDefault(require("../config/errors/AuthorizationError"));
;
// Pull in Environment variables
const ACCESS_TOKEN_SECRET = process.env.AUTH_ACCESS_TOKEN_SECRET || "";
const requireAuthentication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.header("Authorization");
        if (!(authHeader === null || authHeader === void 0 ? void 0 : authHeader.startsWith("Bearer ")))
            throw new AuthorizationError_1.default("Authentication Error", 401, {
                error: "invalid_access_token",
                error_description: "unknown authentication scheme",
            });
        const accessTokenParts = authHeader.split(" ");
        const aTkn = accessTokenParts[1];
        const decoded = jsonwebtoken_1.default.verify(aTkn, ACCESS_TOKEN_SECRET);
        // Attach authenticated user and Access Token to request object
        req.userId = decoded._id;
        req.token = aTkn;
        next();
    }
    catch (err) {
        // Authentication didn't go well
        const expParams = {
            error: "expired_access_token",
            error_description: "Access token is expired",
        };
        if (err.name === "TokenExpiredError")
            return next(new AuthorizationError_1.default("Authentication Error", 401, expParams));
        next(err);
    }
});
exports.requireAuthentication = requireAuthentication;
