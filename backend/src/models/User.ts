import CustomError from "../config/errors/CustomError";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";


interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  refreshToken: string;
}


// CREATE USER SCHEMA
const UserSchema = new mongoose.Schema<IUser>({
  firstName: { type: String, required: [true, "First name is required"] },
  lastName: { type: String, required: [true, "Last name is required"] },
  email: { type: String, required: [true, "Email is required"], unique: true },
  password: {
    type: String,
    required: true,
  },
  refreshToken: 
   { required: true, type: String },
});

//SET SCHEMA OPTION
UserSchema.set("toJSON", {
  virtuals: true,
  transform: function (doc, ret, options) {
    const { firstName, lastName, email } = ret;

    return { firstName, lastName, email }; // return fields we need
  },
});

//ATTACH MIDDLEWARE
UserSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error:any) {
    next(error);
  }
});

//ATTACH CUSTOM STATIC METHODS  
UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await UserModel.findOne({ email });
  if (!user)
    throw new CustomError(
      "Wrong credentials!",
      400,
    );
  const passwdMatch = await bcrypt.compare(password, user.password);
  if (!passwdMatch)
    throw new CustomError(
      "Wrong credentials!",
      400,
    );
  return user;
};


UserSchema.methods.generateAcessToken = function () {
  const user = this;

  // Create signed access token
  const accessToken = jwt.sign(
    {
      _id: user._id.toString(),
      fullName: `${user.firstName} ${user.lastName}`,
      email: user.email,
    },
    process.env.AUTH_ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env.AUTH_ACCESS_TOKEN_EXPIRY,
    }
  );

  return accessToken;
};

UserSchema.methods.generateRefreshToken = async function () {
  const user = this;

  // Create signed refresh token
  const refreshToken = jwt.sign(
    {
      _id: user._id.toString(),
    },
    process.env.AUTH_REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: process.env.AUTH_REFRESH_TOKEN_EXPIRY,
    }
  );

  // Create a 'refresh token hash' from 'refresh token'
  const rTknHash = crypto
    .createHmac("sha256",  process.env.AUTH_REFRESH_TOKEN_SECRET as string)
    .update(refreshToken)
    .digest("hex");

  // Save 'refresh token hash' to database
  user.refreshToken = rTknHash;
  await user.save();

  return refreshToken;
};

const UserModel = mongoose.model("User", UserSchema);

export default UserModel;
