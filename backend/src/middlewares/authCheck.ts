import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction  } from "express";
import AuthorizationError from "../config/errors/AuthorizationError";

export interface AuthenticatedRequest  extends Request {
  userId:string;
  token:string
};

interface TokenData extends JwtPayload {
  _id: string;
}

// Pull in Environment variables
const ACCESS_TOKEN_SECRET = process.env.AUTH_ACCESS_TOKEN_SECRET || "";

export const requireAuthentication = async (req: Request , res: Response, next: NextFunction) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader?.startsWith("Bearer "))
      throw new AuthorizationError(
        "Authentication Error",
        401,
        {
          error: "invalid_access_token",
          error_description: "unknown authentication scheme",
        }
      );

    const accessTokenParts = authHeader.split(" ");
    const aTkn = accessTokenParts[1];

    const decoded = jwt.verify(aTkn, ACCESS_TOKEN_SECRET) as TokenData;

    // Attach authenticated user and Access Token to request object
    (req as AuthenticatedRequest).userId = decoded._id;
    (req as AuthenticatedRequest).token = aTkn;
    next();
  } catch (err:any) {
    // Authentication didn't go well
    console.log(err);

    const expParams = {
      error: "expired_access_token",
      error_description: "Access token is expired",
    };
    if (err.name === "TokenExpiredError")
      return next(
        new AuthorizationError(
          "Authentication Error",
          401,
          expParams
        )
      );

    next(err);
  }
};
