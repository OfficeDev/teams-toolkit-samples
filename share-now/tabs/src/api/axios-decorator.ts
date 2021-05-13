// <copyright file="axios-decorator.ts" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { TeamsUserCredential } from "teamsdev-client";

export class AxiosJWTDecorator {

	/**
	* Post data to API
	* @param  {String} url Resource URI
	* @param  {Object} data Request body data
	*/
	public async post<T = any, R = AxiosResponse<T>>(
		url: string,
		data?: any,
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
	public async delete<T = any, R = AxiosResponse<T>>(
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
	public async put<T = any, R = AxiosResponse<T>>(
		url: string,
		data?: any,
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
	public async get<T = any, R = AxiosResponse<T>>(
		url: string,
		config?: AxiosRequestConfig,
		authenticationRequired: boolean = true
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
	private handleError(error: any): void {
		if (error.hasOwnProperty("response")) {
			const errorStatus = error.response!.status;
			if (errorStatus === 403) {
				window.location.href = "/errorpage/403";
			} else if (errorStatus === 401) {
				window.location.href = "/errorpage/401";
			} else {
				window.location.href = "/errorpage";
			}
		} else {
			window.location.href = "/errorpage";
		}
	}

	private async setupAuthorizationHeader(
		config?: AxiosRequestConfig
	): Promise<AxiosRequestConfig> {
		const credential = new TeamsUserCredential();
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