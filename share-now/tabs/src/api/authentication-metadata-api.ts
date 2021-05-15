// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import axios from "./axios-decorator";
import { getBaseUrl } from '../configVariables';

let baseAxiosUrl = getBaseUrl() + '/api';

/**
* Get authentication metadata from API
* @param  {String} windowLocationOriginDomain Application base URL
* @param  {String} login_hint Login hint for SSO
*/
export const getAuthenticationConsentMetadata = async (windowLocationOriginDomain: string, login_hint: string): Promise<any> => {
    let url = `${baseAxiosUrl}/authenticationMetadata/consentUrl?windowLocationOriginDomain=${windowLocationOriginDomain}&loginhint=${login_hint}`;
    return await axios.get(url, undefined, false);
}