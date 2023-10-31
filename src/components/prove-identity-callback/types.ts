import {ApiResponseResult, DefaultApiResponse} from "../../types";

export interface ProveIdentityCallbackServiceInterface {
    processIdentity: () => Promise<ApiResponseResult<ProcessIdentityResponse>>;
}

export interface ProcessIdentityResponse extends DefaultApiResponse {
    status: IdentityProcessingStatus;
}

export enum IdentityProcessingStatus {
    COMPLETED = "COMPLETED",
    ERROR = "ERROR",
    PROCESSING = "PROCESSING",
}
