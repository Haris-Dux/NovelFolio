

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import dbConnection from "./src/dbConn/index";
import corsOptions from "./src/config/cors/cors";
import { LostErrorHandler,AppErrorHandler } from "./src/config/exceptionHandlers/handler";


//   INITIALIZE EXPRESS APPLICATION
const app = express();
const PORT = process.env.PORT || 5000;

// APPLICATION MIDDLEWARES AND CUSTOMIZATIONS
app.disable("x-powered-by"); 
app.use(express.json()); 
app.use(cookieParser());
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));


// App modular routes
// app.use("/api", routes);

//APPLICATION ERROR HANDLING 
app.use(LostErrorHandler); // 404 error handler middleware
app.use(AppErrorHandler); // General app error handler


//APPLICATION BOOT UP
app.on("ready", () => {
  app.listen(PORT, () => {
    console.log(`App running on port ${PORT}`);
  });
});
dbConnection.then(() => {
  console.log("---Database is connected !!---");
  app.emit("ready");
});
