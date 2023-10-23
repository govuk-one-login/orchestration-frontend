import { expect, sinon } from "../../../test/utils/test-utils";
import { NextFunction, Request, Response } from "express";
import { pageNotFoundHandler } from "../page-not-found-handler";
import { mockRequest, mockResponse } from "mock-req-res";

describe("serverErrorHandler", () => {
    let req: Request; 
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
        req = mockRequest();
        res = mockResponse();
        next = sinon.fake() as unknown as NextFunction;

        pageNotFoundHandler(req, res, next);
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should render 404 template if page not found", () => {
        const expectedTemplate = "errors/404.njk";

        expect(res.render).to.have.been.calledOnceWith(expectedTemplate);
    });

    it("should return a 404 status code if page not found", () => {
        expect(res.status).to.have.been.calledOnceWith(404);
    });
});
