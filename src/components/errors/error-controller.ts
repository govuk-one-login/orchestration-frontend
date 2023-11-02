import { Request, Response } from "express";
import { HTTP_STATUS_CODES } from "../../app.constants";

export function errorPageGet(req: Request, res: Response): void {
  res.status(HTTP_STATUS_CODES.INTERNAL_SERVER_ERROR);
  res.render("errors/500.njk");
}
