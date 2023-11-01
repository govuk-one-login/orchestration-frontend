import { PATH_NAMES } from "../../app.constants";

import * as express from "express";
import { validateSessionMiddleware } from "../../middleware/session-middleware";
import {
  proveIdentityCallbackGet,
  proveIdentityCallbackSessionExpiryError,
} from "./prove-identity-callback-controller";
import { asyncHandler } from "../../utils/async";

const router = express.Router();

router.get(
  PATH_NAMES.PROVE_IDENTITY_CALLBACK,
  validateSessionMiddleware,
  asyncHandler(proveIdentityCallbackGet())
);

router.get(
  PATH_NAMES.PROVE_IDENTITY_CALLBACK_SESSION_EXPIRY_ERROR,
  proveIdentityCallbackSessionExpiryError
);

export { router as proveIdentityCallbackRouter };
