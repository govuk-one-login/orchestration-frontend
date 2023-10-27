import {expect, sinon} from "../../../../test/utils/test-utils";
import {NextFunction, Request, Response} from "express";
import {errorPageGet} from "../error-controller";
import {mockRequest, mockResponse} from "mock-req-res";

describe("errorController", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
        req = mockRequest();
        res = mockResponse();
        next = sinon.spy();

        errorPageGet(req, res);
    });

    afterEach(() => {
        sinon.restore();
    });

    it("should render 500 template if page not found", () => {
        const expectedTemplate = "errors/500.njk";

        expect(res.render).to.have.been.calledOnceWith(expectedTemplate);
    });

    it("should return a 500 status code if page not found", () => {
        expect(res.status).to.have.been.calledOnceWith(500);
    });
});