export function createServiceRedirectErrorUrl(
    redirectUri: string,
    error: string,
    errorDescription: string,
    state: string
): string {
    const redirect = new URL(redirectUri);
    const params = {
        error: error,
        error_description: errorDescription,
        state: state,
    };

    return (
        redirect +
        "?" +
        Object.entries(params)
            .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
            .join("&")
    );
}
