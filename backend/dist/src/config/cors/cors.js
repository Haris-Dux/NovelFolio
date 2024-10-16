"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allowlist = ["http://localhost:5173"];
const corsOptions = {
    origin: function (origin, callback) {
        if (allowlist.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    exposedHeaders: ["WWW-Authenticate"],
};
exports.default = corsOptions;
