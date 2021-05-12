// <copyright file="preferences-api.ts" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import axios from "./axios-decorator";
import { getBaseUrl } from '../configVariables';

let baseAxiosUrl = getBaseUrl() + '/api';

/**
* Get preferences tags for configure preferences
* @param teamId Team Id for which user configured tags needs to be fetched
*/
export const getPreferencesTags = async (teamId: string): Promise<any> => {
    let url = `${baseAxiosUrl}/teampreference?teamId=${teamId}`;
    return await axios.get(url);
}

/**
* Filter tags as per user search input
* @param searchText Search text entered by user for filtering tags
*/
export const filterTags = async (searchText: string): Promise<any> => {
    let url = `${baseAxiosUrl}/teampreference/unique-tags?searchText=${searchText}`;
    return await axios.get(url);
}