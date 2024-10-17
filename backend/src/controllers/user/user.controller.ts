import { AuthenticatedRequest } from "../../middlewares/authCheck";
import { verifyrequiredparams } from "../../middlewares/common";
import UserModel from "../../models/User";
import { NextFunction, Request, Response } from "express";



//FETCH USER PROFILE BY ID
export const fetchUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {

    const userId:string = req.body;
    await verifyrequiredparams(req.body,["id"])
    const retrievedUser = await UserModel.findById(userId);
    res.json({
      success: true,
      user: retrievedUser,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

//FETCH PROFILE OF AUTHENTICATED USER
export const fetchAuthUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const user = await UserModel.findById(userId);

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
