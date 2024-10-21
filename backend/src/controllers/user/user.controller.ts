import CustomError from "../../config/errors/CustomError";
import { AuthenticatedRequest } from "../../middlewares/authCheck";
import { verifyrequiredparams } from "../../middlewares/common";
import UserModel from "../../models/User";
import { NextFunction, Request, Response } from "express";

//FETCH USER PROFILE BY ID
export const fetchUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId: string = req.body;
    await verifyrequiredparams(req.body, ["id"]);
    const retrievedUser = await UserModel.findById(userId);
    res.json({
      success: true,
      user: retrievedUser,
    });
  } catch (error) {
    next(error);
  }
};

//FETCH PROFILE OF AUTHENTICATED USER
export const fetchAuthUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = (req as AuthenticatedRequest).userId;
    const user = await UserModel.findById(userId);

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

//UPDATE USER
export const updateUserInformation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { firstName, lastName, email } = req.body;
    const userId = (req as AuthenticatedRequest).userId;
    await verifyrequiredparams(req, ["userId"]);
    let updateQuery = {};
    if (firstName) {
      updateQuery = { ...updateQuery, firstName };
    }
    if (lastName) {
      updateQuery = { ...updateQuery, lastName };
    }
    if (email) {
      const emailtocheck = email.toLowerCase();
      const isEmailExist = await UserModel.findOne({ email: emailtocheck });
      if (isEmailExist) throw new CustomError("Email already exists", 409);
      else {
        updateQuery = { ...updateQuery, email };
      }
    }
    if (Object.keys(updateQuery).length === 0)
      throw new CustomError("No fields to update", 400);
    const updatedUser = await UserModel.findByIdAndUpdate(userId, updateQuery,{new:true});
    res.status(200).send({ message: "Update Successfull", updatedUser });
  } catch (error: any) {
    next(error);
  }
};
