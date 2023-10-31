import {ApiResponseResult, DefaultApiResponse} from "../../types";

export interface ProveIdentityCallbackServiceInterface {
    processIdentity: () => Promise<ApiResponseResult<ProcessIdentityResponse>>;
}

export interface ProcessIdentityResponse extends DefaultApiResponse {
    clientName?: string,
    redirectUri: string,
    status: IdentityProcessingStatus
    state?: string;
}

export enum IdentityProcessingStatus {
    COMPLETED = "COMPLETED",
    ERROR = "ERROR",
    PROCESSING = "PROCESSING",
}
