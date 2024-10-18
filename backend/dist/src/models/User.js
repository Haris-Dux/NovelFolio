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
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
// CREATE USER SCHEMA
const UserSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: [true, "First name is required"] },
    lastName: { type: String, required: [true, "Last name is required"] },
    email: { type: String, required: [true, "Email is required"], unique: true },
    password: {
        type: String,
        required: true,
    },
    refreshToken: { required: false, type: String },
});
//SET SCHEMA OPTION
UserSchema.set("toJSON", {
    virtuals: true,
    transform: function (doc, ret, options) {
        const { firstName, lastName, email, id: _id } = ret;
        return { firstName, lastName, email, id: _id }; // return fields we need
    },
});
//ATTACH MIDDLEWARE
UserSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (this.isModified("password")) {
                const salt = yield bcrypt_1.default.genSalt(10);
                this.password = yield bcrypt_1.default.hash(this.password, salt);
            }
            next();
        }
        catch (error) {
            next(error);
        }
    });
});
UserSchema.methods.generateAcessToken = function () {
    const user = this;
    // Create signed access token
    const accessToken = jsonwebtoken_1.default.sign({
        _id: user._id.toString(),
        fullName: `${user.firstName} ${user.lastName}`,
        email: user.email,
    }, process.env.AUTH_ACCESS_TOKEN_SECRET, {
        expiresIn: process.env.AUTH_ACCESS_TOKEN_EXPIRY,
    });
    return accessToken;
};
UserSchema.methods.generateRefreshToken = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const user = this;
        // Create signed refresh token
        const refreshToken = jsonwebtoken_1.default.sign({
            _id: user._id.toString(),
        }, process.env.AUTH_REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.AUTH_REFRESH_TOKEN_EXPIRY,
        });
        // Create a 'refresh token hash' from 'refresh token'
        const rTknHash = crypto_1.default
            .createHmac("sha256", process.env.AUTH_REFRESH_TOKEN_SECRET)
            .update(refreshToken)
            .digest("hex");
        // Save 'refresh token hash' to database
        user.refreshToken = rTknHash;
        yield user.save();
        return refreshToken;
    });
};
const UserModel = mongoose_1.default.model("User", UserSchema);
exports.default = UserModel;
