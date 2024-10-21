import mongoose from "mongoose";

const connURI = process.env.MONGODB_URI || "";

mongoose.set("strictQuery", false);
mongoose.set('bufferCommands', false);

const db = mongoose.connect(connURI);

db.catch((err) => {
  if (err.message.code === "ETIMEDOUT") {
    mongoose.connect(connURI);
  }
});

export default db;
