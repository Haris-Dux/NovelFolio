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
exports.deleteImageFromFirebase = exports.uploadImageToFirebase = exports.verifyrequiredparams = void 0;
const CustomError_1 = __importDefault(require("../config/errors/CustomError"));
const verifyrequiredparams = (body, fields) => {
    try {
        let error = false;
        let error_fields = "";
        if (body.length < 1) {
            return new CustomError_1.default('Body is Missing', 400);
        }
        const element = Object.getOwnPropertyNames(body);
        for (const field of fields) {
            if (element.some((e) => e == field)) {
                if (Object.keys(body[field]).length === 0) {
                    if (typeof body[field] == "number") {
                        continue;
                    }
                    else {
                        error = true;
                        error_fields += field + ", ";
                    }
                }
                continue;
            }
            else {
                error = true;
                error_fields += field + ", ";
            }
        }
        if (error) {
            throw new CustomError_1.default(`Required field(s) ${error_fields.slice(0, -2)} is missing`, 400);
        }
        else {
            return Promise.resolve();
        }
    }
    catch (error) {
        throw new CustomError_1.default(error.message, 400);
    }
};
exports.verifyrequiredparams = verifyrequiredparams;
// firebaseFunctions.js
const app_1 = require("firebase/app");
const storage_1 = require("firebase/storage");
const FirebaseConfig_1 = __importDefault(require("../config/firebase/FirebaseConfig"));
(0, app_1.initializeApp)(FirebaseConfig_1.default);
const storage = (0, storage_1.getStorage)();
const uploadImageToFirebase = (file, folder) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!file)
            throw new CustomError_1.default("File Missing", 404);
        console.log('file', file);
        const storageRef = (0, storage_1.ref)(storage, `${folder}/${file.originalname}`);
        const metadata = {
            contentType: file.mimetype,
        };
        const snapshot = yield (0, storage_1.uploadBytesResumable)(storageRef, file.buffer, metadata);
        const downloadURL = yield (0, storage_1.getDownloadURL)(snapshot.ref);
        const result = {
            name: file.originalname,
            type: file.mimetype,
            downloadURL: downloadURL
        };
        return result;
    }
    catch (error) {
        throw new CustomError_1.default(`${error.message}`, 500);
    }
});
exports.uploadImageToFirebase = uploadImageToFirebase;
const deleteImageFromFirebase = (downloadURL) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const imageRef = (0, storage_1.ref)(storage, downloadURL);
        yield (0, storage_1.deleteObject)(imageRef);
    }
    catch (error) {
        throw new CustomError_1.default(`${error.message}`, 500);
    }
});
exports.deleteImageFromFirebase = deleteImageFromFirebase;
