// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { TeamsUserCredential, TeamsUserCredentialAuthConfig } from "@microsoft/teamsfx";

export class AxiosJWTDecorator {

  /**
  * Post data to API
  * @param  {String} url Resource URI
  * @param  {Object} data Request body data
  */
  public async post<T, R = AxiosResponse<T>>(
    url: string,
    data?: { [key: string]: unknown; },
    config?: AxiosRequestConfig
  ): Promise<R> {
    try {
      config = await this.setupAuthorizationHeader(config);
      return await axios.post(url, data, config);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
  * Post data to API
  * @param  {String} url Resource URI
  */
  public async delete<T, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<R> {
    try {
      config = await this.setupAuthorizationHeader(config);
      return await axios.delete(url, config);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
  * Post data to API
  * @param  {String} url Resource URI
  * @param  {Object} data Request body data
  */
  public async put<T, R = AxiosResponse<T>>(
    url: string,
    data?: { [key: string]: unknown; },
    config?: AxiosRequestConfig
  ): Promise<R> {
    try {
      config = await this.setupAuthorizationHeader(config);
      return await axios.put(url, data, config);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
  * Get data to API
  */
  public async get<T, R = AxiosResponse<T>>(
    url: string,
    config?: AxiosRequestConfig,
    authenticationRequired = true
  ): Promise<R> {
    try {
      if (authenticationRequired) {
        config = await this.setupAuthorizationHeader(config);
      }
      return await axios.get(url, config);
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
  * Handle error occurred during API call.
  * @param  {Object} error Error response object
  */
  private handleError(error): void {
    const message = encodeURIComponent(error.response?.data);
    window.location.href = `/index.html#/errorpage/${message}`;
  }

  private async setupAuthorizationHeader(
    config?: AxiosRequestConfig
  ): Promise<AxiosRequestConfig> {
    const authConfig: TeamsUserCredentialAuthConfig = {
      clientId: process.env.REACT_APP_CLIENT_ID ?? "",
      initiateLoginEndpoint: process.env.REACT_APP_START_LOGIN_PAGE_URL ?? "",
    };
    
    const credential = new TeamsUserCredential(authConfig);
    const token = await credential.getToken("");
    if (!config) {
      config = axios.defaults;
    }
    config.headers["Authorization"] = `Bearer ${token?.token}`;
    return config;
  }
}

const axiosJWTDecoratorInstance = new AxiosJWTDecorator();
export default axiosJWTDecoratorInstance;