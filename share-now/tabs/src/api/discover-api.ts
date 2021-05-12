// <copyright file="discover-api.ts" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import axios from "./axios-decorator";
import { getBaseUrl } from '../configVariables';
import { IDiscoverPost } from "../components/card-view/discover-wrapper-page";
import { 
    TeamsUserCredential,
    getResourceConfiguration,
    ResourceType,
} from "teamsdev-client";
import * as axiosDefault from "axios";

let baseAxiosUrl = getBaseUrl() + '/api';

/**
* Get discover posts for tab
* @param pageCount Current page count for which posts needs to be fetched
*/
export const getDiscoverPosts = async (pageCount: number): Promise<any> => {
    let url = `${baseAxiosUrl}/posts?pageCount=${pageCount}`;
    return await axios.get(url);
}

/**
* Get discover posts for tab in a team
* @param teamId Team Id for which discover posts needs to be fetched
* @param pageCount Current page count for which posts needs to be fetched
*/
export const getTeamDiscoverPosts = async (teamId: string, pageCount: number): Promise<any> => {

    let url = `${baseAxiosUrl}/teampost/team-discover-posts?teamId=${teamId}&pageCount=${pageCount}`;
    return await axios.get(url);
}

/**
* Get filtered discover posts for team tab
* @param postTypes Selected post types separated by semicolon
* @param sharedByNames Selected author names separated by semicolon
* @param tags Selected tags separated by semicolon
* @param sortBy Sort post by
* @param teamId Team Id for which posts needs to be fetched
* @param pageCount Current page count for which posts needs to be fetched
*/
export const getFilteredPostsForTeam = async (postTypes: string, sharedByNames: string, tags: string, sortBy: number, teamId: string, pageCount: number): Promise<any> => {
    let url = `${baseAxiosUrl}/teampost/filtered-team-posts?postTypes=${postTypes}&sharedByNames=${sharedByNames}
                &tags=${tags}&sortBy=${sortBy}&teamId=${teamId}&pageCount=${pageCount}`;
    return await axios.get(url);
}

/**
* Get filtered discover posts for personal tab
* @param postTypes Selected post types separated by semicolon
* @param sharedByNames Selected author names separated by semicolon
* @param tags Selected tags separated by semicolon
* @param sortBy Sort post by
* @param pageCount Current page count for which posts needs to be fetched
*/
export const getFilteredPosts = async (postTypes: string, sharedByNames: string, tags: string, sortBy: number, pageCount: number): Promise<any> => {
    let url = `${baseAxiosUrl}/userposts/filtered-posts?postTypes=${postTypes}&sharedByNames=${sharedByNames}
                &tags=${tags}&sortBy=${sortBy}&pageCount=${pageCount}`;
    return await axios.get(url);
}

/**
* Get unique tags
*/
export const getTags = async (): Promise<any> => {
    let url = `${baseAxiosUrl}/teampreference/unique-tags?searchText=*`;
    return await axios.get(url);
}

/**
* Update post content details
* @param postContent Post details object to be updated
*/
export const updatePostContent = async (postContent: any): Promise<any> => {
    return undefined;
}

/**
* Add new post
* @param postContent Post details object to be added
*/
export const addNewPostContent = async (postContent: any): Promise<any> => {
    let url = `${baseAxiosUrl}/posts`;
    return await axios.post(url);
}

/**
* Delete post from storage
* @param post Id of post to be deleted
*/
export const deletePost = async (post: any): Promise<any> => {
    return undefined
}

/**
* Get user votes from storage
* @param post Id of post to be deleted
*/
export const getUserVotes = async (): Promise<any> => {

    let url = `${baseAxiosUrl}/uservote/user-votes`;
    return await axios.get(url);
}

/**
* Add user vote
* @param postDetails Post to vote
*/
export const addUserVote = async (postDetails: any): Promise<any> => {

    let url = `${baseAxiosUrl}/uservote/vote?postCreatedByuserId=${postDetails.userId}&postId=${postDetails.postId}`;
    return await axios.post(url);
}

/**
* delete user vote
* @param userVote Vote object to be deleted from storage
*/
export const deleteUserVote = async (postDetails: IDiscoverPost): Promise<any> => {

    let url = `${baseAxiosUrl}/uservote?postCreatedByuserId=${postDetails.userId}&postId=${postDetails.postId}`;
    return await axios.delete(url);
}

/**
* Get list of authors
*/
export const getAuthors = async (): Promise<any> => {

    let url = `${baseAxiosUrl}/userposts/unique-user-names`;
    return await axios.get(url);
}

/**
* Add new post
* @param searchText Search text typed by user
* @param pageCount Current page count for which posts needs to be fetched
*/
export const filterTitleAndTags = async (searchText: string, pageCount: number): Promise<any> => {
    let url = baseAxiosUrl + `/userposts/search-posts?searchText=${searchText}&pageCount=${pageCount}`;
    return await axios.get(url);
}

/**
* Add new post
* @param searchText Search text typed by user
* @param teamId Team Id for which post needs to be filtered
* @param pageCount Current page count for which posts needs to be fetched
*/
export const filterTitleAndTagsTeam = async (searchText: string, teamId: string, pageCount: number): Promise<any> => {
    let url = baseAxiosUrl + `/teampost/search-posts?searchText=${searchText}&teamId=${teamId}&pageCount=${pageCount}`;
    return await axios.get(url);
}

/**
* Get configured tags for a team.
* @param teamId Team Id for which configuration needs to be fetched
*/
export const getTeamConfiguredTags = async (teamId: string): Promise<any> => {
    let url = `${baseAxiosUrl}/teamtag/configured-tags?teamId=${teamId}`;
    return await axios.get(url);
}

/**
* Get list of authors based on the configured tags in a team.
* @param teamId Team Id for which authors needs to be fetched
*/
export const getTeamAuthorsData = async (teamId: string): Promise<any> => {

    let url = `${baseAxiosUrl}/teampost/team-post-authors?teamId=${teamId}`;
    return await axios.get(url);
}