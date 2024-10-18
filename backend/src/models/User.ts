import mongoose, { Model } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";


export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  refreshToken: string;

  generateAcessToken: () => string;
  generateRefreshToken: () => Promise<string>;
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
   { required: false, type: String },
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

UserSchema.methods.generateAcessToken = function () : string {
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

UserSchema.methods.generateRefreshToken = async function ():Promise<string> {
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

const UserModel:Model<IUser> = mongoose.model<IUser>("User", UserSchema);

export default UserModel;
