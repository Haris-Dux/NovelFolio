"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = "CustomError";
        this.status = statusCode;
        this.cause = message;
    }
}
exports.default = CustomError;
