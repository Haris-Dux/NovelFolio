import { verifyrequiredparams } from "../../middlewares/common";
import { NextFunction, Request, Response } from "express";
import UserModel, { IUser } from "../../models/User";
import CustomError from "../../config/errors/CustomError";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { AuthenticatedRequest } from "../../middlewares/authCheck";
import AuthorizationError from "../../config/errors/AuthorizationError";
import jwt, { JwtPayload } from "jsonwebtoken";



// Top-level constants
const REFRESH_TOKEN = {
  secret: process.env.AUTH_REFRESH_TOKEN_SECRET as string,
  cookie: {
    name: "refreshTkn",
    options: {
      sameSite: "None",
      secure: true,
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  },
};

//SIGN UP USER 
export const signup = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { firstName, lastName, email, password }:IUser = req.body;
    await verifyrequiredparams(req.body,['firstName', 'lastName','email','password',]);

    //check registerd emial
    const emailtocheck = email.toLowerCase();
    const userExists = await UserModel.findOne({ email: emailtocheck })
    if (userExists) {
        throw new CustomError("User already exists",400);
    }

    /* Custom methods on newUser are defined in User model */
    const newUser = new UserModel({ firstName, lastName, email, password });
    await newUser.save(); // Save new User to DB
    const aTkn = newUser.generateAcessToken(); // Create Access Token
    const refreshToken = await newUser.generateRefreshToken(); // Create Refresh Token

    // SET refresh Token cookie in response
    res.cookie(
      REFRESH_TOKEN.cookie.name,
      refreshToken,
      REFRESH_TOKEN.cookie.options as Object
    );

    // Send Response on successful Sign Up
    res.status(201).json({
      success: true,
      user: newUser,
      accessToken: aTkn,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};


//LOGIN USER
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password }:IUser = req.body;
    await verifyrequiredparams(req.body,['email','password']);

    //verify email and password
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
    /* Custom methods on user are defined in User model */
    const aTkn =  user.generateAcessToken(); // Create Access Token
    const refreshToken = await user.generateRefreshToken(); // Create Refresh Token

    // SET refresh Token cookie in response
    res.cookie(
      REFRESH_TOKEN.cookie.name,
      refreshToken,
      REFRESH_TOKEN.cookie.options as Object
    );

    // Send Response on successful Login
    res.json({
      success: true,
      user,
      accessToken: aTkn,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};


//LOGOUT USER
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Authenticated user ID attached on `req` by authentication middleware
    const userId = (req as AuthenticatedRequest).userId;
    const user:any  = await UserModel.findById(userId);
     user.refreshToken = undefined
    await user.save();

    // Set cookie expiry option to past date so it is destroyed
    const expireCookieOptions = Object.assign(
      {},
      REFRESH_TOKEN.cookie.options,
      {
        expires: new Date(1),
      }
    );

    // Destroy refresh token cookie with `expireCookieOptions` containing a past date
    res.cookie(REFRESH_TOKEN.cookie.name, "", expireCookieOptions as Object);
    res.status(205).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//LOGOUT USER FROM ALL DEVICES
export const logoutAllDevices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Authenticated user ID attached on `req` by authentication middleware
    const userId = (req as AuthenticatedRequest).userId;
    const user:any = await UserModel.findById(userId);
    user.refreshToken = "";
    await user.save();

    // Set cookie expiry to past date to mark for destruction
    const expireCookieOptions = Object.assign(
      {},
      REFRESH_TOKEN.cookie.options,
      {
        expires: new Date(1),
      }
    );

    // Destroy refresh token cookie
    res.cookie(REFRESH_TOKEN.cookie.name, "", expireCookieOptions as Object);
    res.status(205).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//REGENERATE NEW ACCESS TOKEN
export const refreshAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const cookies = req.cookies;
    const refreshToken = cookies[REFRESH_TOKEN.cookie.name];

    if (!refreshToken) {
      throw new AuthorizationError(
        "Authentication error!",
        401,
        {
          realm: "Obtain new Access Token",
          error: "no_rft",
          error_description: "Refresh Token is missing!",
        }
      );
    }
    const decodedRefreshTkn = jwt.verify(refreshToken, REFRESH_TOKEN.secret );
    const rTknHash = crypto
      .createHmac("sha256", REFRESH_TOKEN.secret)
      .update(refreshToken)
      .digest("hex");
    const userWithRefreshTkn = await UserModel.findOne({
      _id: (decodedRefreshTkn as JwtPayload )._id,
      "refreshToken": rTknHash,
    });
    if (!userWithRefreshTkn)
      throw new AuthorizationError(
        "Authentication Error",
        401,
        {
          realm: "Obtain new Access Token",
        }
      );

    // GENERATE NEW ACCESSTOKEN
    const newAtkn =  userWithRefreshTkn.generateAcessToken();

    res.status(201);
    res.set({ "Cache-Control": "no-store", Pragma: "no-cache" });

    // Send response with NEW accessToken
    res.json({
      success: true,
      accessToken: newAtkn,
    });
  } catch (error:any) {
    if (error?.name === "JsonWebTokenError"  || error.name === "TokenExpiredError" ) {
      res.clearCookie(REFRESH_TOKEN.cookie.name),
      next(
        new AuthorizationError(error, 401, {
          realm: "Obtain new Access Token",
          error_description: "token error",
        })
      );
      return;
    }
    next(error);
  }
};
