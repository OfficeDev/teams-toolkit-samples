"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.validateScopesType = exports.getUserInfoFromSsoToken = exports.TeamsUserCredential = exports.getResourceConfiguration = exports.DefaultTediousConnectionConfiguration = exports.OnBehalfOfUserCredential = exports.createMicrosoftGraphClient = exports.parseJwt = exports.SimpleTeamsUserCredential = exports.GrantType = exports.ErrorWithCode = exports.ErrorMessage = exports.ErrorCode = exports.getAuthenticationConfiguration = exports.loadConfiguration = exports.config = exports.ResourceType = void 0;
var microsoftTeams = require("@microsoft/teams-js");
var axios_1 = require("axios");
var jwt_decode_1 = require("jwt-decode");
var microsoft_graph_client_1 = require("@microsoft/microsoft-graph-client");
var accessTokenCacheKeyPrefix = "accessToken";
var separator = "-";
var tokenRefreshTimeSpanInMillisecond = 5 * 60 * 1000;
var initializeTeamsSdkTimeoutInMillisecond = 5000;
var loginPageWidth = 600;
var loginPageHeight = 535;
var maxRetryCount = 3;
var retryTimeSpanInMillisecond = 3000;
/**
 * Available resource type.
 * @beta
 */
var ResourceType;
(function (ResourceType) {
    /**
     * SQL database.
     *
     */
    ResourceType[ResourceType["SQL"] = 0] = "SQL";
    /**
     * Rest API.
     *
     */
    ResourceType[ResourceType["API"] = 1] = "API";
})(ResourceType = exports.ResourceType || (exports.ResourceType = {}));
function loadConfiguration(configuration) {
    internalLogger.info("load configuration");
    if (!configuration) {
        var errorMsg = "You are running the code in browser. Configuration must be passed in.";
        internalLogger.error(errorMsg);
        throw new ErrorWithCode(errorMsg, ErrorCode.InvalidParameter);
    }
    exports.config = configuration;
    return;
}
exports.loadConfiguration = loadConfiguration;
function getAuthenticationConfiguration() {
    internalLogger.info("Get authentication configuration");
    if (exports.config) {
        return exports.config.authentication;
    }
    var errorMsg = "Please call loadConfiguration() first before calling getAuthenticationConfiguration().";
    internalLogger.error(errorMsg);
    throw new ErrorWithCode(errorMsg, ErrorCode.InvalidConfiguration);
}
exports.getAuthenticationConfiguration = getAuthenticationConfiguration;
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["InvalidParameter"] = "InvalidParameter";
    ErrorCode["InvalidConfiguration"] = "InvalidConfiguration";
    ErrorCode["InvalidCertificate"] = "InvalidCertificate";
    ErrorCode["InternalError"] = "InternalError";
    ErrorCode["ChannelNotSupported"] = "ChannelNotSupported";
    ErrorCode["RuntimeNotSupported"] = "RuntimeNotSupported";
    ErrorCode["ConsentFailed"] = "ConsentFailed";
    ErrorCode["UiRequiredError"] = "UiRequiredError";
    ErrorCode["TokenExpiredError"] = "TokenExpiredError";
    ErrorCode["ServiceError"] = "ServiceError";
    ErrorCode["FailedOperation"] = "FailedOperation";
})(ErrorCode = exports.ErrorCode || (exports.ErrorCode = {}));
var ErrorMessage = /** @class */ (function () {
    function ErrorMessage() {
    }
    // InvalidConfiguration Error
    ErrorMessage.InvalidConfiguration = "{0} in configuration is invalid: {1}.";
    ErrorMessage.ConfigurationNotExists = "Configuration does not exist. {0}";
    ErrorMessage.ResourceConfigurationNotExists = "{0} resource configuration does not exist.";
    ErrorMessage.MissingResourceConfiguration = "Missing resource configuration with type: {0}, name: {1}.";
    ErrorMessage.AuthenticationConfigurationNotExists = "Authentication configuration does not exist.";
    // RuntimeNotSupported Error
    ErrorMessage.BrowserRuntimeNotSupported = "{0} is not supported in browser.";
    ErrorMessage.NodejsRuntimeNotSupported = "{0} is not supported in Node.";
    // Internal Error
    ErrorMessage.FailToAcquireTokenOnBehalfOfUser = "Failed to acquire access token on behalf of user: {0}";
    // ChannelNotSupported Error
    ErrorMessage.OnlyMSTeamsChannelSupported = "{0} is only supported in MS Teams Channel";
    return ErrorMessage;
}());
exports.ErrorMessage = ErrorMessage;
/**
 * Error class with code and message thrown by the SDK.
 *
 * @beta
 */
var ErrorWithCode = /** @class */ (function (_super) {
    __extends(ErrorWithCode, _super);
    /**
     * Constructor of ErrorWithCode.
     *
     * @param {string} message - error message.
     * @param {ErrorCode} code - error code.
     *
     * @beta
     */
    function ErrorWithCode(message, code) {
        var _newTarget = this.constructor;
        var _this = this;
        if (!code) {
            _this = _super.call(this, message) || this;
            return;
        }
        _this = _super.call(this, message) || this;
        Object.setPrototypeOf(_this, ErrorWithCode.prototype);
        _this.name = _newTarget.name + "." + code;
        _this.code = code;
        return _this;
    }
    return ErrorWithCode;
}(Error));
exports.ErrorWithCode = ErrorWithCode;
var GrantType;
(function (GrantType) {
    GrantType["authCode"] = "authorization_code";
    GrantType["ssoToken"] = "sso_token";
})(GrantType = exports.GrantType || (exports.GrantType = {}));
var internalLogger = console;
internalLogger.verbose = console.log;
var SimpleTeamsUserCredential = /** @class */ (function () {
    function SimpleTeamsUserCredential() {
        this.config = this.loadAndValidateConfig();
        this.ssoToken = null;
    }
    SimpleTeamsUserCredential.prototype.login = function (scopes) {
        return __awaiter(this, void 0, void 0, function () {
            var scopesStr;
            var _this = this;
            return __generator(this, function (_a) {
                scopesStr = typeof scopes === "string" ? scopes : scopes.join(" ");
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        microsoftTeams.app.initialize().then(function () {
                            microsoftTeams.authentication.authenticate({
                                url: _this.config.initiateLoginEndpoint + "?clientId=" + _this.config.clientId + "&scope=" + encodeURI(scopesStr),
                                width: loginPageWidth,
                                height: loginPageHeight
                            }).then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                                var errorMsg, authCodeResult, err_1;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!result) {
                                                errorMsg = "Get empty authentication result from Teams";
                                                console.error(errorMsg);
                                                reject(new ErrorWithCode(errorMsg, ErrorCode.InternalError));
                                                return [2 /*return*/];
                                            }
                                            authCodeResult = JSON.parse(result);
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, this.exchangeAccessTokenFromSimpleAuthServer(scopesStr, authCodeResult)];
                                        case 2:
                                            _a.sent();
                                            resolve();
                                            return [3 /*break*/, 4];
                                        case 3:
                                            err_1 = _a.sent();
                                            reject(this.generateAuthServerError(err_1));
                                            return [3 /*break*/, 4];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); })["catch"](function (reason) {
                                var errorMsg = "Consent failed for the scope " + scopesStr + " with error: " + reason;
                                console.error(errorMsg);
                                reject(new ErrorWithCode(errorMsg, ErrorCode.ConsentFailed));
                            });
                        });
                    })];
            });
        });
    };
    SimpleTeamsUserCredential.prototype.getToken = function (scopes, options) {
        return __awaiter(this, void 0, void 0, function () {
            var ssoToken, scopeStr, cachedKey, cachedToken, accessToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSSOToken()];
                    case 1:
                        ssoToken = _a.sent();
                        scopeStr = typeof scopes === "string" ? scopes : scopes.join(" ");
                        if (!(scopeStr === "")) return [3 /*break*/, 2];
                        internalLogger.info("Get SSO token");
                        return [2 /*return*/, ssoToken];
                    case 2:
                        internalLogger.info("Get access token with scopes: " + scopeStr);
                        return [4 /*yield*/, this.getAccessTokenCacheKey(scopeStr)];
                    case 3:
                        cachedKey = _a.sent();
                        cachedToken = this.getTokenCache(cachedKey);
                        if (cachedToken) {
                            if (!this.isAccessTokenNearExpired(cachedToken)) {
                                internalLogger.verbose("Get access token from cache");
                                return [2 /*return*/, cachedToken];
                            }
                            else {
                                internalLogger.verbose("Cached access token is expired");
                            }
                        }
                        else {
                            internalLogger.verbose("No cached access token");
                        }
                        return [4 /*yield*/, this.getAndCacheAccessTokenFromSimpleAuthServer(scopeStr)];
                    case 4:
                        accessToken = _a.sent();
                        return [2 /*return*/, accessToken];
                }
            });
        });
    };
    /**
     * Get basic user info from SSO token
     *
     * @example
     * ```typescript
     * const currentUser = await credential.getUserInfo();
     * ```
     *
     * @throws {@link ErrorCode|InternalError} when SSO token from Teams client is not valid.
     * @throws {@link ErrorCode|InvalidParameter} when SSO token from Teams client is empty.
     * @throws {@link ErrorCode|RuntimeNotSupported} when runtime is nodeJS.
     *
     * @returns Basic user info with user displayName, objectId and preferredUserName.
     *
     * @beta
     */
    SimpleTeamsUserCredential.prototype.getUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ssoToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        internalLogger.info("Get basic user info from SSO token");
                        return [4 /*yield*/, this.getSSOToken()];
                    case 1:
                        ssoToken = _a.sent();
                        return [2 /*return*/, this.getUserInfoFromSsoToken(ssoToken.token)];
                }
            });
        });
    };
    SimpleTeamsUserCredential.prototype.getUserInfoFromSsoToken = function (ssoToken) {
        if (!ssoToken) {
            var errorMsg = "SSO token is undefined.";
            throw new ErrorWithCode(errorMsg, ErrorCode.InvalidParameter);
        }
        var tokenObject = parseJwt(ssoToken);
        var userInfo = {
            displayName: tokenObject.name,
            objectId: tokenObject.oid,
            preferredUserName: ""
        };
        if (tokenObject.ver === "2.0") {
            userInfo.preferredUserName = tokenObject.preferred_username;
        }
        else if (tokenObject.ver === "1.0") {
            userInfo.preferredUserName = tokenObject.upn;
        }
        return userInfo;
    };
    SimpleTeamsUserCredential.prototype.exchangeAccessTokenFromSimpleAuthServer = function (scopesStr, authCodeResult) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var axiosInstance, retryCount, response, tokenResult, key, err_2;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getAxiosInstance()];
                    case 1:
                        axiosInstance = _c.sent();
                        retryCount = 0;
                        _c.label = 2;
                    case 2:
                        if (!true) return [3 /*break*/, 10];
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 6, , 9]);
                        return [4 /*yield*/, axiosInstance.post("/auth/token", {
                                scope: scopesStr,
                                code: authCodeResult.code,
                                code_verifier: authCodeResult.codeVerifier,
                                redirect_uri: authCodeResult.redirectUri,
                                grant_type: GrantType.authCode
                            })];
                    case 4:
                        response = _c.sent();
                        tokenResult = response.data;
                        return [4 /*yield*/, this.getAccessTokenCacheKey(scopesStr)];
                    case 5:
                        key = _c.sent();
                        this.setTokenCache(key, {
                            token: tokenResult.access_token,
                            expiresOnTimestamp: tokenResult.expires_on
                        });
                        return [2 /*return*/];
                    case 6:
                        err_2 = _c.sent();
                        if (!(((_b = (_a = err_2.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.type) && err_2.response.data.type === "AadUiRequiredException")) return [3 /*break*/, 8];
                        internalLogger.warn("Exchange access token failed, retry...");
                        if (!(retryCount < maxRetryCount)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.sleep(retryTimeSpanInMillisecond)];
                    case 7:
                        _c.sent();
                        retryCount++;
                        return [3 /*break*/, 2];
                    case 8: throw err_2;
                    case 9: return [3 /*break*/, 2];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get access token cache from authentication server
     * @returns Access token
     */
    SimpleTeamsUserCredential.prototype.getAndCacheAccessTokenFromSimpleAuthServer = function (scopesStr) {
        return __awaiter(this, void 0, void 0, function () {
            var axiosInstance, response, accessTokenResult, accessToken, cacheKey, err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        internalLogger.verbose("Get access token from authentication server with scopes: " + scopesStr);
                        return [4 /*yield*/, this.getAxiosInstance()];
                    case 1:
                        axiosInstance = _a.sent();
                        return [4 /*yield*/, axiosInstance.post("/auth/token", {
                                scope: scopesStr,
                                grant_type: GrantType.ssoToken
                            })];
                    case 2:
                        response = _a.sent();
                        accessTokenResult = response.data;
                        accessToken = {
                            token: accessTokenResult.access_token,
                            expiresOnTimestamp: accessTokenResult.expires_on
                        };
                        return [4 /*yield*/, this.getAccessTokenCacheKey(scopesStr)];
                    case 3:
                        cacheKey = _a.sent();
                        this.setTokenCache(cacheKey, accessToken);
                        return [2 /*return*/, accessToken];
                    case 4:
                        err_3 = _a.sent();
                        throw this.generateAuthServerError(err_3);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get SSO token using teams SDK
     * It will try to get SSO token from memory first, if SSO token doesn't exist or about to expired, then it will using teams SDK to get SSO token
     * @returns SSO token
     */
    SimpleTeamsUserCredential.prototype.getSSOToken = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.ssoToken) {
                if (_this.ssoToken.expiresOnTimestamp - Date.now() > tokenRefreshTimeSpanInMillisecond) {
                    internalLogger.verbose("Get SSO token from memory cache");
                    resolve(_this.ssoToken);
                    return;
                }
            }
            var initialized = false;
            microsoftTeams.app.initialize().then(function () {
                initialized = true;
                microsoftTeams.authentication.getAuthToken({ resources: [] }).then(function (token) {
                    if (!token) {
                        var errorMsg = "Get empty SSO token from Teams";
                        internalLogger.error(errorMsg);
                        reject(new ErrorWithCode(errorMsg, ErrorCode.InternalError));
                        return;
                    }
                    var tokenObject = parseJwt(token);
                    if (tokenObject.ver !== "1.0" && tokenObject.ver !== "2.0") {
                        var errorMsg = "SSO token is not valid with an unknown version: " + tokenObject.ver;
                        internalLogger.error(errorMsg);
                        reject(new ErrorWithCode(errorMsg, ErrorCode.InternalError));
                        return;
                    }
                    var ssoToken = {
                        token: token,
                        expiresOnTimestamp: tokenObject.exp * 1000
                    };
                    _this.ssoToken = ssoToken;
                    resolve(ssoToken);
                })["catch"](function (errMessage) {
                    var errorMsg = "Get SSO token failed with error: " + errMessage;
                    internalLogger.error(errorMsg);
                    reject(new ErrorWithCode(errorMsg, ErrorCode.InternalError));
                });
            });
            // If the code not running in Teams, the initialize callback function would never trigger
            setTimeout(function () {
                if (!initialized) {
                    var errorMsg = "Initialize teams sdk timeout, maybe the code is not running inside Teams";
                    internalLogger.error(errorMsg);
                    reject(new ErrorWithCode(errorMsg, ErrorCode.InternalError));
                }
            }, initializeTeamsSdkTimeoutInMillisecond);
        });
    };
    /**
     * Load and validate authentication configuration
     * @returns Authentication configuration
     */
    SimpleTeamsUserCredential.prototype.loadAndValidateConfig = function () {
        internalLogger.verbose("Validate authentication configuration");
        var config = getAuthenticationConfiguration();
        if (!config) {
            internalLogger.error(ErrorMessage.AuthenticationConfigurationNotExists);
            throw new ErrorWithCode(ErrorMessage.AuthenticationConfigurationNotExists, ErrorCode.InvalidConfiguration);
        }
        if (config.initiateLoginEndpoint && config.simpleAuthEndpoint && config.clientId) {
            return config;
        }
        var missingValues = [];
        if (!config.initiateLoginEndpoint) {
            missingValues.push("initiateLoginEndpoint");
        }
        if (!config.simpleAuthEndpoint) {
            missingValues.push("simpleAuthEndpoint");
        }
        if (!config.clientId) {
            missingValues.push("clientId");
        }
        var errorMsg = ErrorMessage.InvalidConfiguration + missingValues.join(", ") + "undefined";
        internalLogger.error(errorMsg);
        throw new ErrorWithCode(errorMsg, ErrorCode.InvalidConfiguration);
    };
    /**
     * Get axios instance with sso token bearer header
     * @returns AxiosInstance
     */
    SimpleTeamsUserCredential.prototype.getAxiosInstance = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ssoToken, axiosInstance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSSOToken()];
                    case 1:
                        ssoToken = _a.sent();
                        axiosInstance = axios_1["default"].create({
                            baseURL: this.config.simpleAuthEndpoint
                        });
                        axiosInstance.interceptors.request.use(function (config) {
                            config.headers.Authorization = "Bearer " + ssoToken.token;
                            return config;
                        });
                        return [2 /*return*/, axiosInstance];
                }
            });
        });
    };
    /**
     * Set access token to cache
     * @param key
     * @param token
     */
    SimpleTeamsUserCredential.prototype.setTokenCache = function (key, token) { };
    /**
     * Get access token from cache.
     * If there is no cache or cannot be parsed, then it will return null
     * @param key
     * @returns Access token or null
     */
    SimpleTeamsUserCredential.prototype.getTokenCache = function (key) {
        return null;
    };
    /**
     * Parses passed value as JSON access token, if value is not a valid json string JSON.parse() will throw an error.
     * @param jsonValue
     */
    SimpleTeamsUserCredential.prototype.validateAndParseJson = function (jsonValue) {
        try {
            var parsedJson = JSON.parse(jsonValue);
            /**
             * There are edge cases in which JSON.parse will successfully parse a non-valid JSON object
             * (e.g. JSON.parse will parse an escaped string into an unescaped string), so adding a type check
             * of the parsed value is necessary in order to be certain that the string represents a valid JSON object.
             *
             */
            return parsedJson && typeof parsedJson === "object" ? parsedJson : null;
        }
        catch (error) {
            return null;
        }
    };
    /**
     * Generate cache key
     * @param scopesStr
     * @returns Access token cache key, a key example: accessToken-userId-clientId-tenantId-scopes
     */
    SimpleTeamsUserCredential.prototype.getAccessTokenCacheKey = function (scopesStr) {
        return __awaiter(this, void 0, void 0, function () {
            var ssoToken, ssoTokenObj, clientId, userObjectId, tenantId, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSSOToken()];
                    case 1:
                        ssoToken = _a.sent();
                        ssoTokenObj = parseJwt(ssoToken.token);
                        clientId = this.config.clientId;
                        userObjectId = ssoTokenObj.oid;
                        tenantId = ssoTokenObj.tid;
                        key = [accessTokenCacheKeyPrefix, userObjectId, clientId, tenantId, scopesStr]
                            .join(separator)
                            .replace(/" "/g, "_");
                        return [2 /*return*/, key];
                }
            });
        });
    };
    /**
     * Check whether the token is about to expire (within 5 minutes)
     * @returns Boolean value indicate whether the token is about to expire
     */
    SimpleTeamsUserCredential.prototype.isAccessTokenNearExpired = function (token) {
        var expireDate = new Date(token.expiresOnTimestamp);
        if (expireDate.getTime() - Date.now() > tokenRefreshTimeSpanInMillisecond) {
            return false;
        }
        return true;
    };
    SimpleTeamsUserCredential.prototype.generateAuthServerError = function (err) {
        var _a, _b;
        var errorMessage = err.message;
        if ((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.type) {
            errorMessage = err.response.data.detail;
            if (err.response.data.type === "AadUiRequiredException") {
                var fullErrorMsg_1 = "Failed to get access token from authentication server, please login first: " +
                    errorMessage;
                internalLogger.warn(fullErrorMsg_1);
                return new ErrorWithCode(fullErrorMsg_1, ErrorCode.UiRequiredError);
            }
            else {
                var fullErrorMsg_2 = "Failed to get access token from authentication server: " + errorMessage;
                internalLogger.error(fullErrorMsg_2);
                return new ErrorWithCode(fullErrorMsg_2, ErrorCode.ServiceError);
            }
        }
        var fullErrorMsg = "Failed to get access token with error: " + errorMessage;
        return new ErrorWithCode(fullErrorMsg, ErrorCode.InternalError);
    };
    SimpleTeamsUserCredential.prototype.sleep = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    return SimpleTeamsUserCredential;
}());
exports.SimpleTeamsUserCredential = SimpleTeamsUserCredential;
function parseJwt(token) {
    try {
        var tokenObj = jwt_decode_1["default"](token);
        if (!tokenObj || !tokenObj.exp) {
            throw new ErrorWithCode("Decoded token is null or exp claim does not exists.", ErrorCode.InternalError);
        }
        return tokenObj;
    }
    catch (err) {
        var errorMsg = "Parse jwt token failed in node env with error: " + err.message;
        internalLogger.error(errorMsg);
        throw new ErrorWithCode(errorMsg, ErrorCode.InternalError);
    }
}
exports.parseJwt = parseJwt;
var SimpleGraphAuthProvider = /** @class */ (function () {
    function SimpleGraphAuthProvider(credential, scopes) {
        this.credential = credential;
        this.scopes =
            scopes ? typeof scopes === "string" ? scopes : scopes.join(" ")
                : "https://graph.microsoft.com/.default";
    }
    SimpleGraphAuthProvider.prototype.getAccessToken = function () {
        return __awaiter(this, void 0, void 0, function () {
            var accessToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.credential.getToken(this.scopes)];
                    case 1:
                        accessToken = _a.sent();
                        if (accessToken) {
                            return [2 /*return*/, accessToken.token];
                        }
                        else {
                            throw new ErrorWithCode("Graph access token is undefined or empty", ErrorCode.InternalError);
                        }
                        return [2 /*return*/];
                }
            });
        });
    };
    return SimpleGraphAuthProvider;
}());
function createMicrosoftGraphClient(credential, scopes) {
    var authProvider = new SimpleGraphAuthProvider(credential, scopes);
    return microsoft_graph_client_1.Client.initWithMiddleware({
        authProvider: authProvider
    });
}
exports.createMicrosoftGraphClient = createMicrosoftGraphClient;
/**
 * Represent on-behalf-of flow to get user identity, and it is designed to be used in Azure Function or Bot scenarios.
 *
 * @remarks
 * Can only be used in server side.
 *
 * @beta
 */
var OnBehalfOfUserCredential = /** @class */ (function () {
    /**
     * Constructor of OnBehalfOfUserCredential
     *
     * @remarks
     * Can Only works in in server side.
     * @beta
     */
    function OnBehalfOfUserCredential(ssoToken) {
        throw new ErrorWithCode("OnBehalfOfUserCredential is not supported in browser.", ErrorCode.RuntimeNotSupported);
    }
    /**
     * Get access token from credential.
     * @remarks
     * Can only be used in server side.
     * @beta
     */
    OnBehalfOfUserCredential.prototype.getToken = function (scopes, options) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                throw new ErrorWithCode("OnBehalfOfUserCredential is not supported in browser.", ErrorCode.RuntimeNotSupported);
            });
        });
    };
    /**
     * Get basic user info from SSO token.
     * @remarks
     * Can only be used in server side.
     * @beta
     */
    OnBehalfOfUserCredential.prototype.getUserInfo = function () {
        throw new ErrorWithCode("OnBehalfOfUserCredential is not supported in browser.", ErrorCode.RuntimeNotSupported);
    };
    return OnBehalfOfUserCredential;
}());
exports.OnBehalfOfUserCredential = OnBehalfOfUserCredential;
/**
* Generate connection configuration consumed by tedious.
* @remarks
* Only works in in server side.
* @beta
*/
var DefaultTediousConnectionConfiguration = /** @class */ (function () {
    function DefaultTediousConnectionConfiguration() {
        throw new ErrorWithCode("DefaultTediousConnectionConfiguration is not supported in browser.", ErrorCode.RuntimeNotSupported);
    }
    return DefaultTediousConnectionConfiguration;
}());
exports.DefaultTediousConnectionConfiguration = DefaultTediousConnectionConfiguration;
/**
 * Get configuration for a specific resource.
 * @param {ResourceType} resourceType - The type of resource
 * @param {string} resourceName - The name of resource, default value is "default".
 *
 * @returns Resource configuration for target resource from global configuration instance.
 *
 * @throws {@link ErrorCode|InvalidConfiguration} when resource configuration with the specific type and name is not found
 *
 * @beta
 */
function getResourceConfiguration(resourceType, resourceName) {
    var _a;
    if (resourceName === void 0) { resourceName = "default"; }
    internalLogger.info("Get resource configuration of " + ResourceType[resourceType] + " from " + resourceName);
    var result = (_a = exports.config.resources) === null || _a === void 0 ? void 0 : _a.find(function (item) { return item.type === resourceType && item.name === resourceName; });
    if (result) {
        return result.properties;
    }
    var errorMsg = "Consent failed for the scope " + ResourceType[resourceType] + " with error: " + resourceName;
    internalLogger.error(errorMsg);
    throw new ErrorWithCode(errorMsg, ErrorCode.InvalidConfiguration);
}
exports.getResourceConfiguration = getResourceConfiguration;
/**
 * Represent Teams current user's identity, and it is used within Teams tab application.
 *
 * @remarks
 * Can only be used within Teams.
 *
 * @beta
 */
var TeamsUserCredential = /** @class */ (function () {
    /**
     * Constructor of TeamsUserCredential.
     * Developer need to call loadConfiguration(config) before using this class.
     *
     * @example
     * ```typescript
     * const config = {
     *  authentication: {
     *    runtimeConnectorEndpoint: "https://xxx.xxx.com",
     *    initiateLoginEndpoint: "https://localhost:3000/auth-start.html",
     *    clientId: "xxx"
     *   }
     * }
       loadConfiguration(config); // No default config from environment variables, developers must provide the config object.
       const credential = new TeamsUserCredential(["https://graph.microsoft.com/User.Read"]);
     * ```
     *
     * @throws {@link ErrorCode|InvalidConfiguration} when client id, initiate login endpoint or simple auth endpoint is not found in config.
     * @throws {@link ErrorCode|RuntimeNotSupported} when runtime is nodeJS.
     *
     * @beta
     */
    function TeamsUserCredential() {
        internalLogger.info("Create teams user credential");
        this.config = this.loadAndValidateConfig();
        this.ssoToken = null;
    }
    /**
     * Popup login page to get user's access token with specific scopes.
     *
     * @remarks
     * Only works in Teams client APP. User will be redirected to the authorization page to login and consent.
     *
     * @example
     * ```typescript
     * await credential.login(["https://graph.microsoft.com/User.Read"]); // single scope using string array
     * await credential.login("https://graph.microsoft.com/User.Read"); // single scopes using string
     * await credential.login(["https://graph.microsoft.com/User.Read", "Calendars.Read"]); // multiple scopes using string array
     * await credential.login("https://graph.microsoft.com/User.Read Calendars.Read"); // multiple scopes using string
     * ```
     * @param scopes - The list of scopes for which the token will have access, before that, we will request user to consent.
     *
     * @throws {@link ErrorCode|InternalError} when failed to login with unknown error.
     * @throws {@link ErrorCode|ServiceError} when simple auth server failed to exchange access token.
     * @throws {@link ErrorCode|ConsentFailed} when user canceled or failed to consent.
     * @throws {@link ErrorCode|InvalidParameter} when scopes is not a valid string or string array.
     * @throws {@link ErrorCode|RuntimeNotSupported} when runtime is nodeJS.
     *
     * @beta
     */
    TeamsUserCredential.prototype.login = function (scopes) {
        return __awaiter(this, void 0, void 0, function () {
            var scopesStr;
            var _this = this;
            return __generator(this, function (_a) {
                validateScopesType(scopes);
                scopesStr = typeof scopes === "string" ? scopes : scopes.join(" ");
                internalLogger.info("Popup login page to get user's access token with scopes: " + scopesStr);
                return [2 /*return*/, new Promise(function (resolve, reject) {
                        microsoftTeams.app.initialize().then(function () {
                            microsoftTeams.authentication.authenticate({
                                url: _this.config.initiateLoginEndpoint + "?clientId=" + _this.config.clientId + "&scope=" + encodeURI(scopesStr),
                                width: loginPageWidth,
                                height: loginPageHeight
                            }).then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                                var errorMsg, authCodeResult, err_4;
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!result) {
                                                errorMsg = "Get empty authentication result from Teams";
                                                console.error(errorMsg);
                                                reject(new ErrorWithCode(errorMsg, ErrorCode.InternalError));
                                                return [2 /*return*/];
                                            }
                                            authCodeResult = JSON.parse(result);
                                            _a.label = 1;
                                        case 1:
                                            _a.trys.push([1, 3, , 4]);
                                            return [4 /*yield*/, this.exchangeAccessTokenFromSimpleAuthServer(scopesStr, authCodeResult)];
                                        case 2:
                                            _a.sent();
                                            resolve();
                                            return [3 /*break*/, 4];
                                        case 3:
                                            err_4 = _a.sent();
                                            reject(this.generateAuthServerError(err_4));
                                            return [3 /*break*/, 4];
                                        case 4: return [2 /*return*/];
                                    }
                                });
                            }); })["catch"](function (reason) {
                                var errorMsg = "Consent failed for the scope " + scopesStr + " with error: " + reason;
                                console.error(errorMsg);
                                reject(new ErrorWithCode(errorMsg, ErrorCode.ConsentFailed));
                            });
                        });
                    })];
            });
        });
    };
    /**
     * Get access token from credential.
     *
     * @example
     * ```typescript
     * await credential.getToken([]) // Get SSO token using empty string array
     * await credential.getToken("") // Get SSO token using empty string
     * await credential.getToken([".default"]) // Get Graph access token with default scope using string array
     * await credential.getToken(".default") // Get Graph access token with default scope using string
     * await credential.getToken(["User.Read"]) // Get Graph access token for single scope using string array
     * await credential.getToken("User.Read") // Get Graph access token for single scope using string
     * await credential.getToken(["User.Read", "Application.Read.All"]) // Get Graph access token for multiple scopes using string array
     * await credential.getToken("User.Read Application.Read.All") // Get Graph access token for multiple scopes using space-separated string
     * await credential.getToken("https://graph.microsoft.com/User.Read") // Get Graph access token with full resource URI
     * await credential.getToken(["https://outlook.office.com/Mail.Read"]) // Get Outlook access token
     * ```
     *
     * @param {string | string[]} scopes - The list of scopes for which the token will have access.
     * @param {GetTokenOptions} options - The options used to configure any requests this TokenCredential implementation might make.
     *
     * @throws {@link ErrorCode|InternalError} when failed to get access token with unknown error.
     * @throws {@link ErrorCode|UiRequiredError} when need user consent to get access token.
     * @throws {@link ErrorCode|ServiceError} when failed to get access token from simple auth server.
     * @throws {@link ErrorCode|InvalidParameter} when scopes is not a valid string or string array.
     * @throws {@link ErrorCode|RuntimeNotSupported} when runtime is nodeJS.
     *
     * @returns User access token of defined scopes.
     * If scopes is empty string or array, it returns SSO token.
     * If scopes is non-empty, it returns access token for target scope.
     * Throw error if get access token failed.
     *
     * @beta
     */
    TeamsUserCredential.prototype.getToken = function (scopes, options) {
        return __awaiter(this, void 0, void 0, function () {
            var ssoToken, scopeStr, cachedKey, cachedToken, accessToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        validateScopesType(scopes);
                        return [4 /*yield*/, this.getSSOToken()];
                    case 1:
                        ssoToken = _a.sent();
                        scopeStr = typeof scopes === "string" ? scopes : scopes.join(" ");
                        if (!(scopeStr === "")) return [3 /*break*/, 2];
                        internalLogger.info("Get SSO token");
                        return [2 /*return*/, ssoToken];
                    case 2:
                        internalLogger.info("Get access token with scopes: " + scopeStr);
                        return [4 /*yield*/, this.getAccessTokenCacheKey(scopeStr)];
                    case 3:
                        cachedKey = _a.sent();
                        cachedToken = this.getTokenCache(cachedKey);
                        if (cachedToken) {
                            if (!this.isAccessTokenNearExpired(cachedToken)) {
                                internalLogger.verbose("Get access token from cache");
                                return [2 /*return*/, cachedToken];
                            }
                            else {
                                internalLogger.verbose("Cached access token is expired");
                            }
                        }
                        else {
                            internalLogger.verbose("No cached access token");
                        }
                        return [4 /*yield*/, this.getAndCacheAccessTokenFromSimpleAuthServer(scopeStr)];
                    case 4:
                        accessToken = _a.sent();
                        return [2 /*return*/, accessToken];
                }
            });
        });
    };
    /**
     * Get basic user info from SSO token
     *
     * @example
     * ```typescript
     * const currentUser = await credential.getUserInfo();
     * ```
     *
     * @throws {@link ErrorCode|InternalError} when SSO token from Teams client is not valid.
     * @throws {@link ErrorCode|InvalidParameter} when SSO token from Teams client is empty.
     * @throws {@link ErrorCode|RuntimeNotSupported} when runtime is nodeJS.
     *
     * @returns Basic user info with user displayName, objectId and preferredUserName.
     *
     * @beta
     */
    TeamsUserCredential.prototype.getUserInfo = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ssoToken;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        internalLogger.info("Get basic user info from SSO token");
                        return [4 /*yield*/, this.getSSOToken()];
                    case 1:
                        ssoToken = _a.sent();
                        return [2 /*return*/, getUserInfoFromSsoToken(ssoToken.token)];
                }
            });
        });
    };
    TeamsUserCredential.prototype.exchangeAccessTokenFromSimpleAuthServer = function (scopesStr, authCodeResult) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function () {
            var axiosInstance, retryCount, response, tokenResult, key, err_5;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.getAxiosInstance()];
                    case 1:
                        axiosInstance = _c.sent();
                        retryCount = 0;
                        _c.label = 2;
                    case 2:
                        if (!true) return [3 /*break*/, 10];
                        _c.label = 3;
                    case 3:
                        _c.trys.push([3, 6, , 9]);
                        return [4 /*yield*/, axiosInstance.post("/auth/token", {
                                scope: scopesStr,
                                code: authCodeResult.code,
                                code_verifier: authCodeResult.codeVerifier,
                                redirect_uri: authCodeResult.redirectUri,
                                grant_type: GrantType.authCode
                            })];
                    case 4:
                        response = _c.sent();
                        tokenResult = response.data;
                        return [4 /*yield*/, this.getAccessTokenCacheKey(scopesStr)];
                    case 5:
                        key = _c.sent();
                        this.setTokenCache(key, {
                            token: tokenResult.access_token,
                            expiresOnTimestamp: tokenResult.expires_on
                        });
                        return [2 /*return*/];
                    case 6:
                        err_5 = _c.sent();
                        if (!(((_b = (_a = err_5.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.type) && err_5.response.data.type === "AadUiRequiredException")) return [3 /*break*/, 8];
                        internalLogger.warn("Exchange access token failed, retry...");
                        if (!(retryCount < maxRetryCount)) return [3 /*break*/, 8];
                        return [4 /*yield*/, this.sleep(retryTimeSpanInMillisecond)];
                    case 7:
                        _c.sent();
                        retryCount++;
                        return [3 /*break*/, 2];
                    case 8: throw err_5;
                    case 9: return [3 /*break*/, 2];
                    case 10: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get access token cache from authentication server
     * @returns Access token
     */
    TeamsUserCredential.prototype.getAndCacheAccessTokenFromSimpleAuthServer = function (scopesStr) {
        return __awaiter(this, void 0, void 0, function () {
            var axiosInstance, response, accessTokenResult, accessToken, cacheKey, err_6;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        internalLogger.verbose("Get access token from authentication server with scopes: " + scopesStr);
                        return [4 /*yield*/, this.getAxiosInstance()];
                    case 1:
                        axiosInstance = _a.sent();
                        return [4 /*yield*/, axiosInstance.post("/auth/token", {
                                scope: scopesStr,
                                grant_type: GrantType.ssoToken
                            })];
                    case 2:
                        response = _a.sent();
                        accessTokenResult = response.data;
                        accessToken = {
                            token: accessTokenResult.access_token,
                            expiresOnTimestamp: accessTokenResult.expires_on
                        };
                        return [4 /*yield*/, this.getAccessTokenCacheKey(scopesStr)];
                    case 3:
                        cacheKey = _a.sent();
                        this.setTokenCache(cacheKey, accessToken);
                        return [2 /*return*/, accessToken];
                    case 4:
                        err_6 = _a.sent();
                        throw this.generateAuthServerError(err_6);
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Get SSO token using teams SDK
     * It will try to get SSO token from memory first, if SSO token doesn't exist or about to expired, then it will using teams SDK to get SSO token
     * @returns SSO token
     */
    TeamsUserCredential.prototype.getSSOToken = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.ssoToken) {
                if (_this.ssoToken.expiresOnTimestamp - Date.now() > tokenRefreshTimeSpanInMillisecond) {
                    internalLogger.verbose("Get SSO token from memory cache");
                    resolve(_this.ssoToken);
                    return;
                }
            }
            var initialized = false;
            microsoftTeams.app.initialize().then(function () {
                initialized = true;
                microsoftTeams.authentication.getAuthToken({ resources: [] }).then(function (token) {
                    if (!token) {
                        var errorMsg = "Get empty SSO token from Teams";
                        internalLogger.error(errorMsg);
                        reject(new ErrorWithCode(errorMsg, ErrorCode.InternalError));
                        return;
                    }
                    var tokenObject = parseJwt(token);
                    if (tokenObject.ver !== "1.0" && tokenObject.ver !== "2.0") {
                        var errorMsg = "SSO token is not valid with an unknown version: " + tokenObject.ver;
                        internalLogger.error(errorMsg);
                        reject(new ErrorWithCode(errorMsg, ErrorCode.InternalError));
                        return;
                    }
                    var ssoToken = {
                        token: token,
                        expiresOnTimestamp: tokenObject.exp * 1000
                    };
                    _this.ssoToken = ssoToken;
                    resolve(ssoToken);
                })["catch"](function (errMessage) {
                    var errorMsg = "Get SSO token failed with error: " + errMessage;
                    internalLogger.error(errorMsg);
                    reject(new ErrorWithCode(errorMsg, ErrorCode.InternalError));
                });
            });
            // If the code not running in Teams, the initialize callback function would never trigger
            setTimeout(function () {
                if (!initialized) {
                    var errorMsg = "Initialize teams sdk timeout, maybe the code is not running inside Teams";
                    internalLogger.error(errorMsg);
                    reject(new ErrorWithCode(errorMsg, ErrorCode.InternalError));
                }
            }, initializeTeamsSdkTimeoutInMillisecond);
        });
    };
    /**
     * Load and validate authentication configuration
     * @returns Authentication configuration
     */
    TeamsUserCredential.prototype.loadAndValidateConfig = function () {
        internalLogger.verbose("Validate authentication configuration");
        var config = getAuthenticationConfiguration();
        if (!config) {
            internalLogger.error(ErrorMessage.AuthenticationConfigurationNotExists);
            throw new ErrorWithCode(ErrorMessage.AuthenticationConfigurationNotExists, ErrorCode.InvalidConfiguration);
        }
        if (config.initiateLoginEndpoint && config.simpleAuthEndpoint && config.clientId) {
            return config;
        }
        var missingValues = [];
        if (!config.initiateLoginEndpoint) {
            missingValues.push("initiateLoginEndpoint");
        }
        if (!config.simpleAuthEndpoint) {
            missingValues.push("simpleAuthEndpoint");
        }
        if (!config.clientId) {
            missingValues.push("clientId");
        }
        var errorMsg = missingValues.join(", ") + " in configuration is invalid: undefined.";
        internalLogger.error(errorMsg);
        throw new ErrorWithCode(errorMsg, ErrorCode.InvalidConfiguration);
    };
    /**
     * Get axios instance with sso token bearer header
     * @returns AxiosInstance
     */
    TeamsUserCredential.prototype.getAxiosInstance = function () {
        return __awaiter(this, void 0, void 0, function () {
            var ssoToken, axiosInstance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSSOToken()];
                    case 1:
                        ssoToken = _a.sent();
                        axiosInstance = axios_1["default"].create({
                            baseURL: this.config.simpleAuthEndpoint
                        });
                        axiosInstance.interceptors.request.use(function (config) {
                            config.headers.Authorization = "Bearer " + ssoToken.token;
                            return config;
                        });
                        return [2 /*return*/, axiosInstance];
                }
            });
        });
    };
    /**
     * Set access token to cache
     * @param key
     * @param token
     */
    TeamsUserCredential.prototype.setTokenCache = function (key, token) {
        Cache.set(key, JSON.stringify(token));
    };
    /**
     * Get access token from cache.
     * If there is no cache or cannot be parsed, then it will return null
     * @param key
     * @returns Access token or null
     */
    TeamsUserCredential.prototype.getTokenCache = function (key) {
        var value = Cache.get(key);
        if (value === null) {
            return null;
        }
        var accessToken = this.validateAndParseJson(value);
        return accessToken;
    };
    /**
     * Parses passed value as JSON access token, if value is not a valid json string JSON.parse() will throw an error.
     * @param jsonValue
     */
    TeamsUserCredential.prototype.validateAndParseJson = function (jsonValue) {
        try {
            var parsedJson = JSON.parse(jsonValue);
            /**
             * There are edge cases in which JSON.parse will successfully parse a non-valid JSON object
             * (e.g. JSON.parse will parse an escaped string into an unescaped string), so adding a type check
             * of the parsed value is necessary in order to be certain that the string represents a valid JSON object.
             *
             */
            return parsedJson && typeof parsedJson === "object" ? parsedJson : null;
        }
        catch (error) {
            return null;
        }
    };
    /**
     * Generate cache key
     * @param scopesStr
     * @returns Access token cache key, a key example: accessToken-userId-clientId-tenantId-scopes
     */
    TeamsUserCredential.prototype.getAccessTokenCacheKey = function (scopesStr) {
        return __awaiter(this, void 0, void 0, function () {
            var ssoToken, ssoTokenObj, clientId, userObjectId, tenantId, key;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getSSOToken()];
                    case 1:
                        ssoToken = _a.sent();
                        ssoTokenObj = parseJwt(ssoToken.token);
                        clientId = this.config.clientId;
                        userObjectId = ssoTokenObj.oid;
                        tenantId = ssoTokenObj.tid;
                        key = [accessTokenCacheKeyPrefix, userObjectId, clientId, tenantId, scopesStr]
                            .join(separator)
                            .replace(/" "/g, "_");
                        return [2 /*return*/, key];
                }
            });
        });
    };
    /**
     * Check whether the token is about to expire (within 5 minutes)
     * @returns Boolean value indicate whether the token is about to expire
     */
    TeamsUserCredential.prototype.isAccessTokenNearExpired = function (token) {
        var expireDate = new Date(token.expiresOnTimestamp);
        if (expireDate.getTime() - Date.now() > tokenRefreshTimeSpanInMillisecond) {
            return false;
        }
        return true;
    };
    TeamsUserCredential.prototype.generateAuthServerError = function (err) {
        var _a, _b;
        var errorMessage = err.message;
        if ((_b = (_a = err.response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.type) {
            errorMessage = err.response.data.detail;
            if (err.response.data.type === "AadUiRequiredException") {
                var fullErrorMsg_3 = "Failed to get access token from authentication server, please login first: " +
                    errorMessage;
                internalLogger.warn(fullErrorMsg_3);
                return new ErrorWithCode(fullErrorMsg_3, ErrorCode.UiRequiredError);
            }
            else {
                var fullErrorMsg_4 = "Failed to get access token from authentication server: " + errorMessage;
                internalLogger.error(fullErrorMsg_4);
                return new ErrorWithCode(fullErrorMsg_4, ErrorCode.ServiceError);
            }
        }
        var fullErrorMsg = "Failed to get access token with error: " + errorMessage;
        return new ErrorWithCode(fullErrorMsg, ErrorCode.InternalError);
    };
    TeamsUserCredential.prototype.sleep = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    return TeamsUserCredential;
}());
exports.TeamsUserCredential = TeamsUserCredential;
/**
 * @internal
 */
function getUserInfoFromSsoToken(ssoToken) {
    if (!ssoToken) {
        var errorMsg = "SSO token is undefined.";
        internalLogger.error(errorMsg);
        throw new ErrorWithCode(errorMsg, ErrorCode.InvalidParameter);
    }
    var tokenObject = parseJwt(ssoToken);
    var userInfo = {
        displayName: tokenObject.name,
        objectId: tokenObject.oid,
        preferredUserName: ""
    };
    if (tokenObject.ver === "2.0") {
        userInfo.preferredUserName = tokenObject.preferred_username;
    }
    else if (tokenObject.ver === "1.0") {
        userInfo.preferredUserName = tokenObject.upn;
    }
    return userInfo;
}
exports.getUserInfoFromSsoToken = getUserInfoFromSsoToken;
/**
 * @internal
 */
function validateScopesType(value) {
    // string
    if (typeof value === "string" || value instanceof String) {
        return;
    }
    // empty array
    if (Array.isArray(value) && value.length === 0) {
        return;
    }
    // string array
    if (Array.isArray(value) && value.length > 0 && value.every(function (item) { return typeof item === "string"; })) {
        return;
    }
    var errorMsg = "The type of scopes is not valid, it must be string or string array";
    internalLogger.error(errorMsg);
    throw new ErrorWithCode(errorMsg, ErrorCode.InvalidParameter);
}
exports.validateScopesType = validateScopesType;
/**
 * Configuration used in initialization.
 * @internal
 */
var Cache = /** @class */ (function () {
    function Cache() {
    }
    Cache.get = function (key) {
        return sessionStorage.getItem(key);
    };
    Cache.set = function (key, value) {
        sessionStorage.setItem(key, value);
    };
    Cache.remove = function (key) {
        sessionStorage.removeItem(key);
    };
    Cache.clear = function () {
        sessionStorage.clear();
    };
    return Cache;
}());
