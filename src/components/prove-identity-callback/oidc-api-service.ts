import {ProcessIdentityResponse} from "./types";

export function getAuthCodeRedirectUri(responseData: ProcessIdentityResponse): string {
    return responseData.redirectUri;
}
