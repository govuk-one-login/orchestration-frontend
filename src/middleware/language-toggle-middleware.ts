import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

export function languageToggleMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  res.locals.htmlLang = req.i18n.language;
  res.locals.showLanguageToggle = process.env.LANGUAGE_TOGGLE === "1";
  res.locals.currentUrl = new URL(
    req.protocol + "://" + req.get("host") + req.originalUrl
  );
  next();
}
