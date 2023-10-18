export function getServiceDomain(): string {
    return process.env.SERVICE_DOMAIN || "localhost";
}

export function supportLanguageCY(): boolean {
    return process.env.SUPPORT_LANGUAGE_CY === "1";
}

export function supportWelshInSupportForms(): boolean {
    return process.env.SUPPORT_WELSH_LANGUAGE_IN_SUPPORT_FORMS === "1";
}
