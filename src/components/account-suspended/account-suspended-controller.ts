import { Request, Response } from "express";

export function accountSuspendedController(req: Request, res: Response): void {
  res.render("account-suspended/index.njk");
}
