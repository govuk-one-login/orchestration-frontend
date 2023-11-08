import { Request, Response } from "express";

export function suspendedPageController(req: Request, res: Response): void {
  res.render("suspended-page/index.njk");
}
