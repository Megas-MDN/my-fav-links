import { ERROR_MESSAGE } from "../constants/erroMessages";
import { STATUS_CODE } from "../constants/statusCode";
import { NextFunction, Response, Request } from "express";

export const auth = async (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  const xSign = req.headers["x-sign"];

  if (!xSign) {
    next({
      status: STATUS_CODE.UNAUTHORIZED,
      message: ERROR_MESSAGE.UNAUTHORIZED,
    });
  } else if (xSign !== process.env.X_SIGN) {
    next({
      status: STATUS_CODE.UNAUTHORIZED,
      message: ERROR_MESSAGE.UNAUTHORIZED,
    });
  } else {
    return next();
  }
};
