import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

export function languageToggleMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
    res.locals.htmlLang = req.i18n.language;
    console.log('process.env.LANGUAGE_TOGGLE',process.env.LANGUAGE_TOGGLE);
    res.locals.showLanguageToggle = process.env.LANGUAGE_TOGGLE === "1";
    next();
}