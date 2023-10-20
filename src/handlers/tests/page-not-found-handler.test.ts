import {expect, sinon} from "../../../test/utils/test-utils";
import {NextFunction, Request, Response} from "express";
import {HTTP_STATUS_CODES} from "../../app.constants";
import {pageNotFoundHandler} from "../page-not-found-handler";

describe("serverErrorHandler", () => {
    let req: Request;
    let res: Response;
    let next: NextFunction;

    beforeEach(() => {
        req = {} as Request;
        res = {
            headersSent: false,
            statusCode: 200,
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            render: () => {
            },
            status: function (newStatus: number) {
                this.statusCode = newStatus;
            },
        } as unknown as Response;
        next = sinon.spy();
    });

    it("should render 404 template if page not found", () => {
        const renderSpy = sinon.spy(res, "render");
        const expectedTemplate = "errors/404.njk";

        pageNotFoundHandler(req, res, next);

        expect(renderSpy).to.have.been.calledOnceWith(expectedTemplate);
        expect(res.statusCode).to.equal(HTTP_STATUS_CODES.NOT_FOUND);
    });
});
