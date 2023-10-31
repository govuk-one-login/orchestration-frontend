import {expect} from "chai";
import {describe} from "mocha";

import {sinon} from "../../../../test/utils/test-utils";
import {Request, Response} from "express";

import {IPV_ERROR_CODES, OIDC_ERRORS,} from "../../../app.constants";
import {mockRequest, mockResponse, RequestOutput, ResponseOutput,} from "mock-req-res";
import {proveIdentityCallbackGet} from "../prove-identity-callback-controller";
import {IdentityProcessingStatus, ProcessIdentityResponse, ProveIdentityCallbackServiceInterface,} from "../types";
import {ApiResponseResult} from "../../../types";

describe("prove identity callback controller", () => {
    let req: RequestOutput = mockRequest();
    let res: ResponseOutput = mockResponse();

    let mockIdentityProcessed: ApiResponseResult<ProcessIdentityResponse> = {
        data: {
            message: "test",
            code: -1,
            clientName: "testClient",
            redirectUri: "http://someservice.com/auth",
            status: IdentityProcessingStatus.PROCESSING,
            state: "testState"
        },
        success: true
    }

    afterEach(() => {
        sinon.restore();
    });

    describe("proveIdentityCallbackGet", () => {
        it("should redirect to auth code when identity processing complete", async () => {
            mockIdentityProcessed.data.status = IdentityProcessingStatus.COMPLETED;
            const fakeProveIdentityService: ProveIdentityCallbackServiceInterface = {
                processIdentity: sinon.fake.returns(mockIdentityProcessed),
            } as unknown as ProveIdentityCallbackServiceInterface;

            await proveIdentityCallbackGet(fakeProveIdentityService)(
                req as Request,
                res as Response
            );

            expect(res.redirect).to.have.been.calledWith("http://someservice.com/auth");
        });

        it("should render index when identity is being processed ", async () => {
            mockIdentityProcessed.data.status = IdentityProcessingStatus.PROCESSING;
            const fakeProveIdentityService: ProveIdentityCallbackServiceInterface = {
                processIdentity: sinon.fake.returns(mockIdentityProcessed),
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
            mockIdentityProcessed.data.status = IdentityProcessingStatus.ERROR;
            const fakeProveIdentityService: ProveIdentityCallbackServiceInterface = {
                processIdentity: sinon.fake.returns(mockIdentityProcessed),
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
});
