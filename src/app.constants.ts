export enum LOCALE {
  EN = "en",
  CY = "cy",
}

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
  ERROR_PAGE: "/error",
};
