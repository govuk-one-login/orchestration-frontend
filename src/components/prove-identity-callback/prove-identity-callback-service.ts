import {ApiResponseResult} from "../../types";
import {IdentityProcessingStatus, ProcessIdentityResponse, ProveIdentityCallbackServiceInterface} from "./types";

export function proveIdentityCallbackService(): ProveIdentityCallbackServiceInterface {
    const identityProcessed = async function (): Promise<ApiResponseResult<ProcessIdentityResponse>> {
        return {
            data: {
                message: "mock",
                code: -1,
                status: Math.random() < 0.5
                    ? IdentityProcessingStatus.PROCESSING
                    : Math.random() < 0.95
                        ? IdentityProcessingStatus.COMPLETED
                        : IdentityProcessingStatus.ERROR
            },
            success: true
        }
    }
    return {
        processIdentity: identityProcessed
    }
}
