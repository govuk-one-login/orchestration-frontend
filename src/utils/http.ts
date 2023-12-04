import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosError,
  AxiosResponse,
  AxiosRequestHeaders,
} from "axios";
import { getApiKey, getApiBaseUrl } from "../config";
import { ApiResponseResult } from "../types";
import { HTTP_STATUS_CODES } from "../app.constants";
import { ApiError } from "./error";

const headers: Partial<AxiosRequestHeaders> = {
  Accept: "application/json",
  "Content-Type": "application/json; charset=utf-8",
  "Access-Control-Allow-Credentials": "true",
  "X-Requested-With": "XMLHttpRequest",
};

export interface ConfigOptions {
  sessionId?: string;
  clientSessionId?: string;
  sourceIp?: string;
  persistentSessionId?: string;
}

export function createApiResponse<T>(
  response: AxiosResponse,
  status: number[] = [HTTP_STATUS_CODES.OK]
): ApiResponseResult<T> {
  return {
    success: status.includes(response.status),
    data: response.data,
  };
}

export function getRequestConfig(options: ConfigOptions): AxiosRequestConfig {
  const config: AxiosRequestConfig = {
    headers: {
      "X-API-Key": getApiKey(),
    },
    proxy: false,
  };

  if (options.sessionId) {
    config.headers["Session-Id"] = options.sessionId;
  }

  if (options.clientSessionId) {
    config.headers["Client-Session-Id"] = options.clientSessionId;
  }

  if (options.sourceIp) {
    config.headers["X-Forwarded-For"] = options.sourceIp;
  }

  if (options.persistentSessionId) {
    config.headers["di-persistent-session-id"] = options.persistentSessionId;
  }

  return config;
}

export class Http {
  private instance: AxiosInstance;

  get client(): AxiosInstance {
    return this.instance || this.initHttp();
  }

  private static handleError(error: AxiosError) {
    let apiError;

    if (error.response && error.response.data) {
      apiError = new ApiError(
        error.message,
        error.response.status,
        error.response.data.toString()
      );
    } else {
      apiError = new ApiError(error.message);
    }

    return Promise.reject(apiError);
  }

  private initHttp() {
    const http = axios.create({
      baseURL: getApiBaseUrl(),
      headers: headers,
      validateStatus: (status) => {
        return (
          status >= HTTP_STATUS_CODES.OK &&
          status <= HTTP_STATUS_CODES.BAD_REQUEST
        );
      },
    });

    http.interceptors.response.use(
      (response) => response,
      (error) => Http.handleError(error)
    );

    this.instance = http;
    return http;
  }
}
export const http = new Http();
