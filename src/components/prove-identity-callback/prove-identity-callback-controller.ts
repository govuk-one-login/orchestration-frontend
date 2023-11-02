import { Request, Response } from "express";
import { ExpressRouteFunc } from "../../types";
import { IdentityProcessingStatus, ProveIdentityCallbackServiceInterface } from "./types";
import { IPV_ERROR_CODES, OIDC_ERRORS } from "../../app.constants";
import { createServiceRedirectErrorUrl } from "../../utils/error";
import { proveIdentityCallbackService } from "./prove-identity-callback-service";
import { getAuthCodeRedirectUri } from "./oidc-api-service";

export function proveIdentityCallbackGet(
  service: ProveIdentityCallbackServiceInterface = proveIdentityCallbackService()
): ExpressRouteFunc {
  return async function (req: Request, res: Response) {
    const sessionId = res.locals.sessionId;
    const clientSessionId = res.locals.clientSessionId;

    // TODO: Get response from ipv-api (ProcessingIdentityHandler)
    const response = await service.processIdentity(sessionId, clientSessionId);

    if (response.data.status === IdentityProcessingStatus.PROCESSING) {
      return res.render("prove-identity-callback/index.njk", {
        serviceName: response.data.clientName,
      });
    }

    let redirectPath: string;

    if (response.data.status === IdentityProcessingStatus.COMPLETED) {
      // TODO: Get auth token from oidc-api (AuthCodeHandler)
      redirectPath = getAuthCodeRedirectUri(sessionId, clientSessionId);

    } else {
      redirectPath = createServiceRedirectErrorUrl(
        response.data.redirectUri,
        OIDC_ERRORS.ACCESS_DENIED,
        IPV_ERROR_CODES.IDENTITY_PROCESSING_TIMEOUT,
        response.data.state
      );
    }

    return res.redirect(redirectPath);
  };
}

export function proveIdentityCallbackSessionExpiryError(
  req: Request,
  res: Response
): void {
  res.render("prove-identity-callback/session-expiry-error.njk");
}
