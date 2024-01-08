import { pino } from "pino";
import PinoHttp from "pino-http";
import { getLogLevel } from "../config";

const ignorePaths = [
  "/orch-frontend/public/scripts/cookies.js",
  "/orch-frontend/public/scripts/all.js",
  "/orch-frontend/public/style.css",
  "/orch-frontend/public/scripts",
  "/orch-frontend/public/scripts/application.js",
  "/orch-frontend/assets/images/govuk-crest-2x.png",
  "/orch-frontend/assets/fonts/bold-b542beb274-v2.woff2",
  "/orch-frontend/assets/fonts/bold-b542beb274-v2.woff2",
  "/orch-frontend/assets/images/favicon.ico",
  "/orch-frontend/assets/fonts/light-94a07e06a1-v2.woff2",
  "/orch-frontend/health",
];

const logger = pino({
  name: "di-orch",
  level: getLogLevel(),
  serializers: {
    req: (req) => {
      return {
        id: req.id,
        method: req.method,
        url: req.url,
        from: getRefererFrom(req.headers.referer),
      };
    },
    res: (res) => {
      return {
        status: res.statusCode,
        sessionId: res.locals.sessionId,
        clientSessionId: res.locals.clientSessionId,
        persistentSessionId: res.locals.persistentSessionId,
        languageFromCookie: res.locals.language?.toUpperCase(),
      };
    },
  },
});

export function getRefererFrom(referer: string): string {
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      return refererUrl.pathname;
    } catch (error) {
      return undefined;
    }
  } else {
    return undefined;
  }
}

const loggerMiddleware = PinoHttp({
  logger,
  wrapSerializers: false,
  autoLogging: {
    ignore: (req) => ignorePaths.includes(req.url),
  },
  customErrorMessage: function (error, res) {
    return "request errored with status code: " + res.statusCode;
  },
  customSuccessMessage: function (res) {
    if (res.statusCode === 404) {
      return "resource not found";
    }
    return `request completed with status code of:${res.statusCode}`;
  },
  customAttributeKeys: {
    responseTime: "timeTaken",
  },
});

export { logger, loggerMiddleware };
