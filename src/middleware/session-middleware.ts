import {NextFunction, Request, Response} from "express";
import {HTTP_STATUS_CODES} from "../app.constants";

export function validateSessionMiddleware(
    req: Request,
    res: Response,
    next: NextFunction
): void {
    if (req.get("Cookie").match(".*gs.*")) {
        return next();
    }

    res.status(HTTP_STATUS_CODES.UNAUTHORIZED);
    res.redirect("/error")
}
