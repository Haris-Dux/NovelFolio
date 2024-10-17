"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const index_1 = __importDefault(require("./src/dbConn/index"));
const cors_2 = __importDefault(require("./src/config/cors/cors"));
const handler_1 = require("./src/config/exceptionHandlers/handler");
const index_routes_1 = __importDefault(require("./src/routes/index.routes"));
//   INITIALIZE EXPRESS APPLICATION
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// APPLICATION MIDDLEWARES AND CUSTOMIZATIONS
app.disable("x-powered-by");
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)(cors_2.default));
app.options("*", (0, cors_1.default)(cors_2.default));
// App modular routes
app.use("/api", index_routes_1.default);
//APPLICATION ERROR HANDLING 
app.use(handler_1.LostErrorHandler); // 404 error handler middleware
app.use(handler_1.AppErrorHandler); // General app error handler
//APPLICATION BOOT UP
app.on("ready", () => {
    app.listen(PORT, () => {
        console.log(`App running on port ${PORT}`);
    });
});
index_1.default.then(() => {
    console.log("---Database is connected !!---");
    app.emit("ready");
});
