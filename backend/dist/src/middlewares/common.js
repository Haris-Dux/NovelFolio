"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyrequiredparams = void 0;
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
