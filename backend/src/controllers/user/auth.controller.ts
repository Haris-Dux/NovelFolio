import { verifyrequiredparams } from "../../middlewares/common";
import { NextFunction, Request, Response } from "express";
import UserModel from "../../models/User";



// Top-level constants
const REFRESH_TOKEN = {
  secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
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
    const { firstName, lastName, email, password } = req.body;
    await verifyrequiredparams(req.body,['firstName', 'lastName','email','password',]);

    /* Custom methods on newUser are defined in User model */
    const newUser = new UserModel({ firstName, lastName, email, password });
    await newUser.save(); // Save new User to DB
    const aTkn = await newUser.generateAcessToken(); // Create Access Token
    const refreshToken = await newUser.generateRefreshToken(); // Create Refresh Token

    // SET refresh Token cookie in response
    res.cookie(
      REFRESH_TOKEN.cookie.name,
      refreshToken,
      REFRESH_TOKEN.cookie.options
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
    const errors = verifyrequiredparams(req);
  
    const { email, password } = req.body;

    /* Custom methods on user are defined in User model */
    const user = await User.findByCredentials(email, password); // Identify and retrieve user by credentials
    const aTkn = await user.generateAcessToken(); // Create Access Token
    const refreshToken = await user.generateRefreshToken(); // Create Refresh Token

    // SET refresh Token cookie in response
    res.cookie(
      REFRESH_TOKEN.cookie.name,
      refreshToken,
      REFRESH_TOKEN.cookie.options
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
const logout = async (req, res, next) => {
  try {
    // Authenticated user ID attached on `req` by authentication middleware
    const userId = req.userId;
    const user = await User.findById(userId);

    const cookies = req.cookies;
    const refreshToken = cookies[REFRESH_TOKEN.cookie.name];
    // Create a refresh token hash
    const rTknHash = crypto
      .createHmac("sha256", REFRESH_TOKEN.secret)
      .update(refreshToken)
      .digest("hex");
    user.tokens = user.tokens.filter((tokenObj) => tokenObj.token !== rTknHash);
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
    res.cookie(REFRESH_TOKEN.cookie.name, "", expireCookieOptions);
    res.status(205).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//LOGOUT USER FROM ALL DEVICES
const logoutAllDevices = async (req, res, next) => {
  try {
    // Authenticated user ID attached on `req` by authentication middleware
    const userId = req.userId;
    const user = await User.findById(userId);

    user.tokens = undefined;
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
    res.cookie(REFRESH_TOKEN.cookie.name, "", expireCookieOptions);
    res.status(205).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//REGENERATE NEW ACCESS TOKEN
const refreshAccessToken = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const refreshToken = cookies[REFRESH_TOKEN.cookie.name];

    if (!refreshToken) {
      throw new AuthorizationError(
        "Authentication error!",
        undefined,
        "You are unauthenticated",
        {
          realm: "Obtain new Access Token",
          error: "no_rft",
          error_description: "Refresh Token is missing!",
        }
      );
    }

    const decodedRefreshTkn = jwt.verify(refreshToken, REFRESH_TOKEN.secret);
    const rTknHash = crypto
      .createHmac("sha256", REFRESH_TOKEN.secret)
      .update(refreshToken)
      .digest("hex");
    const userWithRefreshTkn = await User.findOne({
      _id: decodedRefreshTkn._id,
      "tokens.token": rTknHash,
    });
    if (!userWithRefreshTkn)
      throw new AuthorizationError(
        "Authentication Error",
        undefined,
        "You are unauthenticated!",
        {
          realm: "Obtain new Access Token",
        }
      );

    // GENERATE NEW ACCESSTOKEN
    const newAtkn = await userWithRefreshTkn.generateAcessToken();

    res.status(201);
    res.set({ "Cache-Control": "no-store", Pragma: "no-cache" });

    // Send response with NEW accessToken
    res.json({
      success: true,
      accessToken: newAtkn,
    });
  } catch (error) {
    if (error?.name === "JsonWebTokenError") {
      next(
        new AuthorizationError(error, undefined, "You are unauthenticated", {
          realm: "Obtain new Access Token",
          error_description: "token error",
        })
      );
      return;
    }
    next(error);
  }
};
