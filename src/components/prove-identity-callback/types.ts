import { ApiResponseResult, DefaultApiResponse } from "../../types";

export interface ProveIdentityCallbackServiceInterface {
  getIdentityProgress: (
    sessionId: string,
    clientSessionId: string,
    persistentSessionId: string
  ) => Promise<ApiResponseResult<IdentityProgressResponse>>;
  getAuthCodeRedirectUri: (
    sessionId: string,
    clientSessionId: string,
    sourceIp: string,
    persistentSessionId: string
  ) => Promise<ApiResponseResult<AuthCodeResponse>>;
}

export interface IdentityProgressResponse extends DefaultApiResponse {
  clientName: string;
  redirectUri: string;
  status: IdentityProgressStatus;
  state: string;
}

export enum IdentityProgressStatus {
  COMPLETED = "COMPLETED",
  ERROR = "ERROR",
  PROCESSING = "PROCESSING",
  NO_ENTRY = "NO_ENTRY",
}

export interface AuthCodeResponse extends DefaultApiResponse {
  location: string;
}
