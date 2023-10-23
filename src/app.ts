import express from "express";
import {pageNotFoundHandler} from "./handlers/page-not-found-handler";
import {configureNunjucks} from "./config/nunchucks";
import path from "path";
import i18next from "i18next";
import Backend from "i18next-fs-backend";
import {i18nextConfigurationOptions} from "./config/i18next";
import i18nextMiddleware from "i18next-http-middleware";
import {getCookieLanguageMiddleware} from "./middleware/cookie-lang-middleware";

const APP_VIEWS = [
    path.join(__dirname, "components"),
    path.resolve("node_modules/govuk-frontend/"),
];

function createApp(): express.Application {
    const app: express.Application = express();

    app.use(
        "/assets",
        express.static(path.resolve("node_modules/govuk-frontend/govuk/assets"))
    );

    app.use("/public", express.static(path.join(__dirname, "public")));
    app.set("view engine", configureNunjucks(app, APP_VIEWS));

    i18next
        .use(Backend)
        .use(i18nextMiddleware.LanguageDetector)
        .init(
            i18nextConfigurationOptions(
                path.join(__dirname, "locales/{{lng}}/{{ns}}.json")
            )
        );

    app.use(i18nextMiddleware.handle(i18next));
    app.use(getCookieLanguageMiddleware);

    app.use(pageNotFoundHandler);

    return app;
}

export {createApp};
