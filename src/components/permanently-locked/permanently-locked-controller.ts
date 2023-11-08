import { Request, Response } from "express";

export function permanentlyLockedController(req: Request, res: Response): void {
  res.render("permanently-locked/index.njk");
}
