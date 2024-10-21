"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connURI = process.env.MONGODB_URI || "";
mongoose_1.default.set("strictQuery", false);
mongoose_1.default.set('bufferCommands', false);
const db = mongoose_1.default.connect(connURI);
db.catch((err) => {
    if (err.message.code === "ETIMEDOUT") {
        mongoose_1.default.connect(connURI);
    }
});
exports.default = db;
