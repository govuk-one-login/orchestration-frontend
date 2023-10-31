import {NextFunction, Request, Response} from "express";

export type ExpressRouteFunc = (
    req: Request,
    res: Response,
    next?: NextFunction
) => void | Promise<void>;

export interface ApiResponseResult<T> {
    success: boolean;
    data: T;
}

export interface DefaultApiResponse {
    message: string;
    code: number;
}
