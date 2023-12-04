import { Request, Response } from "express";
import { ExpressRouteFunc } from "../../types";
import {
  IdentityProgressStatus,
  ProveIdentityCallbackServiceInterface,
} from "./types";
import { IPV_ERROR_CODES, OIDC_ERRORS } from "../../app.constants";
import { createServiceRedirectErrorUrl } from "../../utils/error";
import { proveIdentityCallbackService } from "./prove-identity-callback-service";

export function proveIdentityCallbackGet(
  service: ProveIdentityCallbackServiceInterface = proveIdentityCallbackService()
): ExpressRouteFunc {
  return async function (req: Request, res: Response) {
    const { sessionId, clientSessionId, persistentSessionId } = res.locals;

    const response = await service.getIdentityProgress(
      sessionId,
      clientSessionId,
      persistentSessionId
    );
    if (response.data.status === IdentityProgressStatus.PROCESSING) {
      return res.render("prove-identity-callback/index.njk", {
        serviceName: response.data.clientName,
      });
    }

    let redirectPath: string;

    if (response.data.status === IdentityProgressStatus.COMPLETED) {
      const authCodeResponse = await service.getAuthCodeRedirectUri(
        sessionId,
        clientSessionId,
        req.ip,
        persistentSessionId
      );
      redirectPath = authCodeResponse.data.location;
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
