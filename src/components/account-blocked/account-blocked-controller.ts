import { Request, Response } from "express";

export function accountBlockedController(req: Request, res: Response): void {
  res.render("account-blocked/index.njk");
}
