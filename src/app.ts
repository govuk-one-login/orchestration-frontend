import express from "express";
import cookieParser from "cookie-parser";
import {pageNotFoundHandler} from "./handlers/page-not-found-handler";
import {configureNunjucks} from "./config/templating";
import path from "path";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import { i18nextConfigurationOptions } from "./config/i18next";
import i18nextMiddleware from "i18next-http-middleware";
import {PATH_NAMES} from "./app.constants";
import {errorPageGet} from "./components/errors/error-controller";
import {proveIdentityCallbackRouter} from "./components/prove-identity-callback/prove-identity-callback-routes";
import {noCacheMiddleware} from "./middleware/no-cache-middleware";
import {getSessionIdMiddleware} from "./middleware/session-middleware";

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

  app.use(i18nextMiddleware.handle(i18next));

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
    app.get(PATH_NAMES.ERROR_PAGE, errorPageGet);
    app.use(pageNotFoundHandler);

  return app;
}

export { createApp };
