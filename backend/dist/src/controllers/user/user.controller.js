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
exports.updateUserInformation = exports.fetchAuthUserProfile = exports.fetchUserProfile = void 0;
const CustomError_1 = __importDefault(require("../../config/errors/CustomError"));
const common_1 = require("../../middlewares/common");
const User_1 = __importDefault(require("../../models/User"));
//FETCH USER PROFILE BY ID
const fetchUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.body;
        yield (0, common_1.verifyrequiredparams)(req.body, ["id"]);
        const retrievedUser = yield User_1.default.findById(userId);
        res.json({
            success: true,
            user: retrievedUser,
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.fetchUserProfile = fetchUserProfile;
//FETCH PROFILE OF AUTHENTICATED USER
const fetchAuthUserProfile = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const user = yield User_1.default.findById(userId);
        res.json({
            success: true,
            user,
        });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.fetchAuthUserProfile = fetchAuthUserProfile;
//UPDATE USER
const updateUserInformation = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email } = req.body;
        const userId = req.userId;
        yield (0, common_1.verifyrequiredparams)(req, ["userId"]);
        let updateQuery = {};
        if (firstName) {
            updateQuery = Object.assign(Object.assign({}, updateQuery), { firstName });
        }
        if (lastName) {
            updateQuery = Object.assign(Object.assign({}, updateQuery), { lastName });
        }
        if (email) {
            const emailtocheck = email.toLowerCase();
            const isEmailExist = yield User_1.default.findOne({ email: emailtocheck });
            if (isEmailExist)
                throw new CustomError_1.default("Email already exists", 409);
            else {
                updateQuery = Object.assign(Object.assign({}, updateQuery), { email });
            }
        }
        if (Object.keys(updateQuery).length === 0)
            throw new CustomError_1.default("No fields to update", 400);
        const updatedUser = yield User_1.default.findByIdAndUpdate(userId, updateQuery, { new: true });
        res.status(200).send({ message: "Update Successfull", updatedUser });
    }
    catch (error) {
        next(error);
    }
});
exports.updateUserInformation = updateUserInformation;
