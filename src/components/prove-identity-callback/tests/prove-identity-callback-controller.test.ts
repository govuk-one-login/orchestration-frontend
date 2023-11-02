import { expect } from "chai";
import { describe } from "mocha";

import { sinon } from "../../../../test/utils/test-utils";
import { Request, Response } from "express";

import { IPV_ERROR_CODES, OIDC_ERRORS, } from "../../../app.constants";
import { mockRequest, mockResponse, RequestOutput, ResponseOutput, } from "mock-req-res";
import {
  proveIdentityCallbackGet,
  proveIdentityCallbackSessionExpiryError
} from "../prove-identity-callback-controller";
import { IdentityProcessingStatus, ProcessIdentityResponse, ProveIdentityCallbackServiceInterface, } from "../types";
import { ApiResponseResult } from "../../../types";

describe("prove identity callback controller", () => {
  let req: RequestOutput = mockRequest();
  let res: ResponseOutput = mockResponse();

  afterEach(() => {
    sinon.restore();
  });

  describe("proveIdentityCallbackGet", () => {
    it("should redirect to auth code when identity processing complete", async () => {
      const fakeProveIdentityService: ProveIdentityCallbackServiceInterface = {
        processIdentity: sinon.fake.returns(mockProcessIdentity(IdentityProcessingStatus.COMPLETED)),
      } as unknown as ProveIdentityCallbackServiceInterface;

      await proveIdentityCallbackGet(fakeProveIdentityService)(
        req as Request,
        res as Response
      );

      expect(res.redirect).to.have.been.calledWith("https://mock-successful-redirect.gov.uk");
    });

    it("should render index when identity is being processed ", async () => {
      const fakeProveIdentityService: ProveIdentityCallbackServiceInterface = {
        processIdentity: sinon.fake.returns(mockProcessIdentity(IdentityProcessingStatus.PROCESSING)),
      } as unknown as ProveIdentityCallbackServiceInterface;

      await proveIdentityCallbackGet(fakeProveIdentityService)(
        req as Request,
        res as Response
      );

      expect(res.render).to.have.been.calledWith(
        "prove-identity-callback/index.njk"
      );
    });

    it("should redirect to error page when identity processing has errored", async () => {
      const fakeProveIdentityService: ProveIdentityCallbackServiceInterface = {
        processIdentity: sinon.fake.returns(mockProcessIdentity(IdentityProcessingStatus.ERROR)),
      } as unknown as ProveIdentityCallbackServiceInterface;

      await proveIdentityCallbackGet(fakeProveIdentityService)(
        req as Request,
        res as Response
      );

      expect(res.redirect).to.have.been.calledWith(
        `http://someservice.com/auth?error=${
          OIDC_ERRORS.ACCESS_DENIED
        }&error_description=${encodeURIComponent(
          IPV_ERROR_CODES.IDENTITY_PROCESSING_TIMEOUT
        )}&state=${encodeURIComponent("testState")}`
      );
    });
  });

  function mockProcessIdentity(status: IdentityProcessingStatus): ApiResponseResult<ProcessIdentityResponse> {
    return {
      data: {
        message: "test",
        code: -1,
        clientName: "testClient",
        redirectUri: "http://someservice.com/auth",
        status: status,
        state: "testState"
      },
      success: true
    }
  }

  describe("proveIdentityCallbackSessionExpiryError", () => {
    it("should redirect to error page when callback session expires", () => {
      const expectedTemplate = "prove-identity-callback/session-expiry-error.njk";

      proveIdentityCallbackSessionExpiryError(req, res);

      expect(res.render).to.have.been.calledWith(expectedTemplate);
    });
  });
});
