export function getServiceDomain(): string {
  return process.env.SERVICE_DOMAIN || "localhost";
}

export function supportLanguageCY(): boolean {
  return process.env.SUPPORT_LANGUAGE_CY === "1";
}

export function getLogLevel(): string {
  return process.env.LOGS_LEVEL || "debug";
}
