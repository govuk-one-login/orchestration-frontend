import { ApiResponseResult } from "../../types";
import {
  AuthCodeResponse,
  IdentityProgressResponse,
  ProveIdentityCallbackServiceInterface,
} from "./types";
import {
  createApiResponse,
  getRequestConfig,
  http,
  Http,
} from "../../utils/http";
import { API_ENDPOINTS } from "../../app.constants";

export function proveIdentityCallbackService(
  axios: Http = http
): ProveIdentityCallbackServiceInterface {
  const getIdentityProgress = async function (
    sessionId: string,
    clientSessionId: string
  ): Promise<ApiResponseResult<IdentityProgressResponse>> {
    const response = await axios.client.get<IdentityProgressResponse>(
      API_ENDPOINTS.IDENTITY_PROGRESS,
      getRequestConfig({
        sessionId: sessionId,
        clientSessionId: clientSessionId,
      })
    );
    return createApiResponse<IdentityProgressResponse>(response);
  };
  const getAuthCodeRedirectUri = async function (
    sessionId: string,
    clientSessionId: string,
    sourceIp: string,
    persistentSessionId: string
  ): Promise<ApiResponseResult<AuthCodeResponse>> {
    const config = getRequestConfig({
      sessionId: sessionId,
      clientSessionId: clientSessionId,
      sourceIp: sourceIp,
      persistentSessionId: persistentSessionId,
    });
    const response = await axios.client.get<AuthCodeResponse>(
      API_ENDPOINTS.AUTH_CODE,
      config
    );
    return createApiResponse<AuthCodeResponse>(response);
  };
  return {
    getIdentityProgress,
    getAuthCodeRedirectUri,
  };
}
