// <copyright file="teams-config-tab-api.ts" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import axios from "./axios-decorator";
import { getBaseUrl } from '../configVariables';

let baseAxiosUrl = getBaseUrl() + '/api';

/**
* Post config tags for discover tab
* @param postContent Tags to be saved
*/
export const submitConfigTags = async (postContent: any): Promise<any> => {
    let url = `${baseAxiosUrl}/teamtag`;
    return await axios.post(url, postContent);
}

/**
* Get preferences tags for configure preferences
* @param teamId Team Id for which configured tags needs to be fetched
*/
export const getConfigTags = async (teamId: string): Promise<any> => {
    let url = `${baseAxiosUrl}/teamtag?teamId=${teamId}`;
    return await axios.get(url);
}