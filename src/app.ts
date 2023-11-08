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
import { serverErrorHandler } from "./handlers/internal-server-error-handler";
import { errorPageGet } from "./components/errors/error-controller";
import { PATH_NAMES } from "./app.constants";
import { permanentlyLockedController } from "./components/permanently-locked/permanently-locked-controller";

const APP_VIEWS = [
  path.join(__dirname, "components"),
  path.resolve("node_modules/govuk-frontend/"),
];

async function createApp(): Promise<express.Application> {
  const app: express.Application = express();

  app.use(noCacheMiddleware);

  app.use(
    "/assets",
    express.static(path.resolve("node_modules/govuk-frontend/govuk/assets"))
  );

  app.use("/public", express.static(path.join(__dirname, "public")));
  app.set("view engine", configureNunjucks(app, APP_VIEWS));

  await i18next
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init(
      i18nextConfigurationOptions(
        path.join(__dirname, "locales/{{lng}}/{{ns}}.json")
      )
    );
  app.use(i18nextMiddleware.handle(i18next));

  app.use(cookieParser());

  app.use(getSessionIdMiddleware);

  app.use(proveIdentityCallbackRouter);
  app.get(PATH_NAMES.NOT_AVAILABLE, permanentlyLockedController);
  app.get(PATH_NAMES.ERROR_PAGE, errorPageGet);
  app.use(serverErrorHandler);
  app.use(pageNotFoundHandler);

  return app;
}

export { createApp };
