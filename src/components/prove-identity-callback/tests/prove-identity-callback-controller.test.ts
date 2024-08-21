import { expect } from "chai";
import { describe } from "mocha";

import { sinon } from "../../../../test/utils/test-utils";
import { Request, Response } from "express";

import { IPV_ERROR_CODES, OIDC_ERRORS } from "../../../app.constants";
import {
  mockRequest,
  mockResponse,
  RequestOutput,
  ResponseOutput,
} from "mock-req-res";
import {
  proveIdentityCallbackGet,
  proveIdentityCallbackSessionExpiryError,
} from "../prove-identity-callback-controller";
import {
  IdentityProgressStatus,
  IdentityProgressResponse,
  ProveIdentityCallbackServiceInterface,
  AuthCodeResponse,
} from "../types";
import { ApiResponseResult } from "../../../types";

describe("prove identity callback controller", () => {
  const req: RequestOutput = mockRequest();
  const res: ResponseOutput = mockResponse();

  afterEach(() => {
    sinon.restore();
  });

  describe("proveIdentityCallbackGet", () => {
    it("should redirect to auth code when identity processing complete", async () => {
      const fakeProveIdentityService: ProveIdentityCallbackServiceInterface = {
        getIdentityProgress: sinon.fake.returns(
          mockGetIdentityProgress(IdentityProgressStatus.COMPLETED)
        ),
        getAuthCodeRedirectUri: sinon.fake.returns(
          mockGetAuthCodeRedirectUri()
        ),
      } as unknown as ProveIdentityCallbackServiceInterface;

      await proveIdentityCallbackGet(fakeProveIdentityService)(
        req as Request,
        res as Response
      );

      /* eslint-disable-next-line @typescript-eslint/no-unused-expressions */
      expect(fakeProveIdentityService.getAuthCodeRedirectUri).to.have.been
        .called;

      expect(res.redirect).to.have.been.calledWith(
        "https://mock-successful-redirect.gov.uk"
      );
    });

    it("should render index when identity is being processed ", async () => {
      const fakeProveIdentityService: ProveIdentityCallbackServiceInterface = {
        getIdentityProgress: sinon.fake.returns(
          mockGetIdentityProgress(IdentityProgressStatus.PROCESSING)
        ),
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
        getIdentityProgress: sinon.fake.returns(
          mockGetIdentityProgress(IdentityProgressStatus.ERROR)
        ),
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

    it("should redirect to error page when not on identity flow", async () => {
      const fakeProveIdentityService: ProveIdentityCallbackServiceInterface = {
        getIdentityProgress: sinon.fake.returns(
          mockGetIdentityProgress(IdentityProgressStatus.NO_ENTRY)
        ),
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

  function mockGetAuthCodeRedirectUri(): ApiResponseResult<AuthCodeResponse> {
    return {
      data: {
        message: "test",
        code: -1,
        location: "https://mock-successful-redirect.gov.uk",
      },
      success: true,
    };
  }
  function mockGetIdentityProgress(
    status: IdentityProgressStatus
  ): ApiResponseResult<IdentityProgressResponse> {
    return {
      data: {
        message: "test",
        code: -1,
        clientName: "testClient",
        redirectUri: "http://someservice.com/auth",
        status: status,
        state: "testState",
      },
      success: true,
    };
  }

  describe("proveIdentityCallbackSessionExpiryError", () => {
    it("should redirect to error page when callback session expires", () => {
      const expectedTemplate =
        "prove-identity-callback/session-expiry-error.njk";

      proveIdentityCallbackSessionExpiryError(req, res);

      expect(res.render).to.have.been.calledWith(expectedTemplate);
    });
  });
});
