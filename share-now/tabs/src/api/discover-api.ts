// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import axios from "./axios-decorator";
import { getBaseUrl } from '../configVariables';
import { IDiscoverPost } from "../components/card-view/discover-wrapper-page";

const baseAxiosUrl = getBaseUrl() + '/api';

/**
* Get discover posts for tab
* @param pageCount Current page count for which posts needs to be fetched
*/
export const getDiscoverPosts = async (pageCount: number): Promise<any> => {

  const url = `${baseAxiosUrl}/posts?pageCount=${pageCount}`;
  return await axios.get(url);
}

/**
* Update post content details
* @param postContent Post details object to be updated
*/
export const updatePostContent = async (postContent: any): Promise<any> => {

  const url = `${baseAxiosUrl}/posts/${postContent.postId}`;
  return await axios.put(url, postContent);
}

/**
* Add new post
* @param postContent Post details object to be added
*/
export const addNewPostContent = async (postContent: any): Promise<any> => {

  const url = `${baseAxiosUrl}/posts`;
  return await axios.post(url, postContent);
}

/**
* Delete post from storage
* @param post Id of post to be deleted
*/
export const deletePost = async (post: any): Promise<any> => {

  const url = `${baseAxiosUrl}/posts/${post.postId}`;
  return await axios.delete(url);
}

/**
* Add user vote
* @param postDetails Post to vote
*/
export const addUserVote = async (postDetails: any): Promise<any> => {

  const url = `${baseAxiosUrl}/vote/${postDetails.postId}`;
  return await axios.post(url);
}

/**
* delete user vote
* @param userVote Vote object to be deleted from storage
*/
export const deleteUserVote = async (postDetails: IDiscoverPost): Promise<any> => {

  const url = `${baseAxiosUrl}/vote/${postDetails.postId}`;
  return await axios.delete(url);
}