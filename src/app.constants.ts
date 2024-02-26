import dotenv from "dotenv";
dotenv.config();

export enum LOCALE {
  EN = "en",
  CY = "cy",
}

export const API_ENDPOINTS = {
  AUTH_CODE: "/auth-code",
  IDENTITY_PROGRESS: "/identity-progress",
};

export const HTTP_STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};
export const IPV_ERROR_CODES = {
  IDENTITY_PROCESSING_TIMEOUT: "Identity check timeout",
};

export const OIDC_ERRORS = {
  ACCESS_DENIED: "access_denied",
};

export const PATH_NAMES = {
  NOT_AVAILABLE: "/not-available",
  PROVE_IDENTITY_CALLBACK: "/ipv-callback",
  PROVE_IDENTITY_CALLBACK_SESSION_EXPIRY_ERROR:
    "/ipv-callback-session-expiry-error",
  UNAVAILABLE: "/unavailable",
  ERROR_PAGE: "/error",
};

export const GTM = {
  GA4_CONTAINER_ID: process.env.GOOGLE_ANALYTICS_4_GTM_CONTAINER_ID,
  UA_CONTAINER_ID: process.env.UNIVERSAL_ANALYTICS_GTM_CONTAINER_ID,
  ANALYTICS_COOKIE_DOMAIN: process.env.ANALYTICS_COOKIE_DOMAIN,
  GA4_DISABLED: process.env.GA4_DISABLED,
  UA_DISABLED: process.env.UA_DISABLED,
}
