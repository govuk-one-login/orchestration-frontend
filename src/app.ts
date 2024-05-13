import express from "express";
import cookieParser from "cookie-parser";
import { pageNotFoundHandler } from "./handlers/page-not-found-handler";
import { configureNunjucks } from "./config/templating";
import path from "path";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import { i18nextConfigurationOptions } from "./config/i18next";
import i18nextMiddleware from "i18next-http-middleware";
import { proveIdentityCallbackRouter } from "./components/prove-identity-callback/prove-identity-callback-routes";
import { noCacheMiddleware } from "./middleware/no-cache-middleware";
import { getSessionIdMiddleware } from "./middleware/session-middleware";
import { setGTM } from "./middleware/analytics-middleware";
import { languageToggleMiddleware } from "./middleware/language-toggle-middleware";
import { serverErrorHandler } from "./handlers/internal-server-error-handler";
import { errorPageGet } from "./components/errors/error-controller";
import { PATH_NAMES } from "./app.constants";
import { permanentlyLockedController } from "./components/permanently-locked/permanently-locked-controller";
import { suspendedPageController } from "./components/suspended-page/suspended-page-controller";
import { loggerMiddleware } from "./utils/logger";

const APP_VIEWS = [
  path.join(__dirname, "components"),
  path.resolve("node_modules/govuk-frontend/"),
  path.resolve("node_modules/@govuk-one-login/"),
];

async function createApp(): Promise<express.Application> {
  const app: express.Application = express();
  const router = express.Router();
  app.use("/orch-frontend", router);

  router.get("/health", (req, res) => {
    res.status(200).send("OK");
  });

  router.use(noCacheMiddleware);
  router.use(loggerMiddleware);

  router.use(
    "/assets",
    express.static(path.resolve("node_modules/govuk-frontend/govuk/assets"))
  );

  router.use("/public", express.static(path.join(__dirname, "public")));
  app.set("view engine", configureNunjucks(app, APP_VIEWS));

  await i18next
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init(
      i18nextConfigurationOptions(
        path.join(__dirname, "locales/{{lng}}/{{ns}}.json")
      )
    );
  router.use(i18nextMiddleware.handle(i18next));

  router.use(cookieParser());

  router.use(getSessionIdMiddleware);
  router.use(setGTM);

  router.use(languageToggleMiddleware);

  router.use(proveIdentityCallbackRouter);
  router.get(PATH_NAMES.UNAVAILABLE_PERMANENT, permanentlyLockedController);
  router.get(PATH_NAMES.UNAVAILABLE_TEMPORARY, suspendedPageController);
  router.get(PATH_NAMES.ERROR_PAGE, errorPageGet);
  router.use(serverErrorHandler);
  router.use(pageNotFoundHandler);

  return app;
}

export { createApp };
