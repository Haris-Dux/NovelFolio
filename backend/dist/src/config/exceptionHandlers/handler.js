"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LostErrorHandler = LostErrorHandler;
exports.AppErrorHandler = AppErrorHandler;
function LostErrorHandler(req, res, next) {
    res.status(404);
    res.json({
        error: "Resource not found",
    });
}
// Exception Handler
function AppErrorHandler(err, req, res, next) {
    res.status(err.status || 500);
    if (err.authorizationError === true) {
        res.set(err.authHeaders);
    }
    const error = (err === null || err === void 0 ? void 0 : err.cause) || (err === null || err === void 0 ? void 0 : err.message);
    res.json(error);
}
