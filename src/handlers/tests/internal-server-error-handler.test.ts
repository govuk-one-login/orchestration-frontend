import { expect, sinon } from "../../../test/utils/test-utils";
import { NextFunction, Request, Response } from "express";
import { mockRequest } from "mock-req-res";
import { serverErrorHandler } from "../internal-server-error-handler";

describe("errorController", () => {
  let err: Error;
  let req: Request;
  let res: Response;
  let next: NextFunction;

  beforeEach(() => {
    req = mockRequest();
    res = {
      headersSent: false,
      statusCode: 200,
      render: () => {
      },
      status: function (newStatus: number) {
        this.statusCode = newStatus;
      },
    } as unknown as Response;
    next = sinon.spy();
  });


  afterEach(() => {
    sinon.restore();
  });

  it("should call next if headers have already been sent", () => {
    res.headersSent = true;
    const err = new Error("Test error");

    serverErrorHandler(err, req, res, next);

    expect(next).to.have.been.calledOnceWith(err);
    expect(res.statusCode).to.equal(200);
  });

  it("should render 500 template if internal server error", () => {
    const expectedTemplate = "errors/500.njk";
    const renderSpy = sinon.spy(res, "render");

    serverErrorHandler(err, req, res, next);

    expect(renderSpy).to.have.been.calledOnceWith(expectedTemplate);
    expect(res.statusCode).to.equal(500);
  });
});
