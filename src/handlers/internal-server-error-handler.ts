import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS_CODES } from "../app.constants";

export function serverErrorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (res.headersSent) {
    return next(err);
  }
  res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  res.render("errors/500.njk");
}
