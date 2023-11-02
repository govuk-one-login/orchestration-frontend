import { NextFunction, Request, Response } from "express";
import { HTTP_STATUS_CODES } from "../app.constants";
import xss from "xss";

export function getSessionIdMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.cookies && req.cookies.gs) {
    const ids = xss(req.cookies["gs"]).split(".");

    res.locals.sessionId = ids[0];
    res.locals.clientSessionId = ids[1];
  }
  if (req.cookies && req.cookies["di-persistent-session-id"]) {
    res.locals.persistentSessionId = xss(
      req.cookies["di-persistent-session-id"]
    );
  }
  next();
}

export function validateSessionMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (req.cookies.gs) {
    return next();
  }

  res.status(HTTP_STATUS_CODES.UNAUTHORIZED);
  res.redirect("/error");
}
