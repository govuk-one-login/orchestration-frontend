import {expect} from "chai";
import {describe} from "mocha";

import {sinon} from "../../../../test/utils/test-utils";
import {Request, Response} from "express";

import {IPV_ERROR_CODES, OIDC_ERRORS, PATH_NAMES,} from "../../../app.constants";
import {mockRequest, mockResponse, RequestOutput, ResponseOutput,} from "mock-req-res";
import {proveIdentityCallbackGet} from "../prove-identity-callback-controller";
import {IdentityProcessingStatus, ProveIdentityCallbackServiceInterface,} from "../types";

describe("prove identity callback controller", () => {
    let req: RequestOutput = mockRequest();
    let res: ResponseOutput = mockResponse();

    afterEach(() => {
        sinon.restore();
    });

    describe("proveIdentityCallbackGet", () => {
        it("should redirect to auth code when identity processing complete", async () => {
            const fakeProveIdentityService: ProveIdentityCallbackServiceInterface = {
                processIdentity: sinon.fake.returns({
                    success: true,
                    data: {
                        status: IdentityProcessingStatus.COMPLETED,
                    },
                }),
            } as unknown as ProveIdentityCallbackServiceInterface;

            await proveIdentityCallbackGet(fakeProveIdentityService)(
                req as Request,
                res as Response
            );

            expect(res.redirect).to.have.been.calledWith("https://mock-redirect.gov.uk?code=1234");
        });

        it("should render index when identity is being processed ", async () => {
            const fakeProveIdentityService: ProveIdentityCallbackServiceInterface = {
                processIdentity: sinon.fake.returns({
                    success: true,
                    data: {
                        status: IdentityProcessingStatus.PROCESSING,
                    },
                }),
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
                processIdentity: sinon.fake.returns({
                    success: true,
                    data: {
                        status: IdentityProcessingStatus.ERROR,
                    },
                }),
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
                )}&state=state`
            );
        });
    });
});
