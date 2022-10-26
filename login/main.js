"use strict";
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
var core = require("@actions/core");
var exec = require("@actions/exec");
var io = require("@actions/io");
var actions_secret_parser_1 = require("actions-secret-parser");
var ServicePrincipalLogin_1 = require("./PowerShell/ServicePrincipalLogin");
var azPath;
var prefix = !!process.env.AZURE_HTTP_USER_AGENT ? "".concat(process.env.AZURE_HTTP_USER_AGENT) : "";
var azPSHostEnv = !!process.env.AZUREPS_HOST_ENVIRONMENT ? "".concat(process.env.AZUREPS_HOST_ENVIRONMENT) : "";
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var loginOptions, isAzCLISuccess, usrAgentRepo, actionName, userAgentString, azurePSHostEnv, azureSupportedCloudName, output_1, execOptions, creds, secrets, environment, enableAzPSSession, allowNoSubscriptionsLogin, servicePrincipalId, servicePrincipalKey, tenantId, subscriptionId, resourceManagerEndpointUrl, enableOIDC, federatedToken, audience, _a, issuer, subjectClaim, error_1, error_2, baseUri, suffixKeyvault, suffixStorage, profileVersion, error_3, commonArgs, args, spnlogin, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 26, 27, 28]);
                    loginOptions = {
                        silent: true,
                        listeners: {
                            stderr: function (data) {
                                var error = data.toString();
                                var startsWithWarning = error.toLowerCase().startsWith('warning');
                                var startsWithError = error.toLowerCase().startsWith('error');
                                // printing ERROR
                                if (error && error.trim().length !== 0 && !startsWithWarning) {
                                    if (startsWithError) {
                                        //removing the keyword 'ERROR' to avoid duplicates while throwing error
                                        error = error.slice(5);
                                    }
                                    core.setFailed(error);
                                }
                            }
                        }
                    };
                    isAzCLISuccess = false;
                    usrAgentRepo = "".concat(process.env.GITHUB_REPOSITORY);
                    actionName = 'AzureLogin';
                    userAgentString = (!!prefix ? "".concat(prefix, "+") : '') + "GITHUBACTIONS/".concat(actionName, "@v1_").concat(usrAgentRepo);
                    azurePSHostEnv = (!!azPSHostEnv ? "".concat(azPSHostEnv, "+") : '') + "GITHUBACTIONS/".concat(actionName, "@v1_").concat(usrAgentRepo);
                    core.exportVariable('AZURE_HTTP_USER_AGENT', userAgentString);
                    core.exportVariable('AZUREPS_HOST_ENVIRONMENT', azurePSHostEnv);
                    return [4 /*yield*/, io.which("az", true)];
                case 1:
                    azPath = _b.sent();
                    core.debug("az cli version used: ".concat(azPath));
                    azureSupportedCloudName = new Set([
                        "azureusgovernment",
                        "azurechinacloud",
                        "azuregermancloud",
                        "azurecloud",
                        "azurestack"
                    ]);
                    output_1 = "";
                    execOptions = {
                        listeners: {
                            stdout: function (data) {
                                output_1 += data.toString();
                            }
                        }
                    };
                    return [4 /*yield*/, executeAzCliCommand("--version", true, execOptions)];
                case 2:
                    _b.sent();
                    core.debug("az cli version used:\n".concat(output_1));
                    creds = core.getInput('creds', { required: false });
                    secrets = creds ? new actions_secret_parser_1.SecretParser(creds, actions_secret_parser_1.FormatType.JSON) : null;
                    environment = core.getInput("environment").toLowerCase();
                    enableAzPSSession = core.getInput('enable-AzPSSession').toLowerCase() === "true";
                    allowNoSubscriptionsLogin = core.getInput('allow-no-subscriptions').toLowerCase() === "true";
                    servicePrincipalId = core.getInput('client-id', { required: false });
                    servicePrincipalKey = null;
                    tenantId = core.getInput('tenant-id', { required: false });
                    subscriptionId = core.getInput('subscription-id', { required: false });
                    resourceManagerEndpointUrl = "https://management.azure.com/";
                    switch (environment) {
                        case 'azurecloud':
                            resourceManagerEndpointUrl = "https://management.usgovcloudapi.net/";
                            break;
                        case 'azureusgovernment':
                            resourceManagerEndpointUrl = "https://management.usgovcloudapi.net/";
                            break;
                        case 'azuregermancloud':
                            resourceManagerEndpointUrl = "https://management.microsoftazure.de";
                            break;
                        case 'azurechinacloud':
                            resourceManagerEndpointUrl = "https://management.chinacloudapi.cn/";
                            break;
                        default:
                            resourceManagerEndpointUrl = "https://management.azure.com/";
                            break;
                    }
                    enableOIDC = true;
                    federatedToken = null;
                    // If any of the individual credentials (clent_id, tenat_id, subscription_id) is present.
                    if (servicePrincipalId || tenantId || subscriptionId) {
                        //If few of the individual credentials (clent_id, tenat_id, subscription_id) are missing in action inputs.
                        if (!(servicePrincipalId && tenantId && (subscriptionId || allowNoSubscriptionsLogin)))
                            throw new Error("Few credentials are missing. ClientId, tenantId are mandatory. SubscriptionId is also mandatory if allow-no-subscriptions is not set.");
                    }
                    else {
                        if (creds) {
                            core.debug('using creds JSON...');
                            enableOIDC = false;
                            servicePrincipalId = secrets.getSecret("$.clientId", true);
                            servicePrincipalKey = secrets.getSecret("$.clientSecret", true);
                            tenantId = secrets.getSecret("$.tenantId", true);
                            subscriptionId = secrets.getSecret("$.subscriptionId", true);
                            resourceManagerEndpointUrl = secrets.getSecret("$.resourceManagerEndpointUrl", false);
                        }
                        else {
                            throw new Error("Credentials are not passed for Login action.");
                        }
                    }
                    //generic checks 
                    //servicePrincipalKey is only required in non-oidc scenario.
                    if (!servicePrincipalId || !tenantId || !(servicePrincipalKey || enableOIDC)) {
                        throw new Error("Not all values are present in the credentials. Ensure clientId, clientSecret and tenantId are supplied.");
                    }
                    if (!subscriptionId && !allowNoSubscriptionsLogin) {
                        throw new Error("Not all values are present in the credentials. Ensure subscriptionId is supplied.");
                    }
                    if (!azureSupportedCloudName.has(environment)) {
                        throw new Error("Unsupported value for environment is passed.The list of supported values for environment are ‘azureusgovernment', ‘azurechinacloud’, ‘azuregermancloud’, ‘azurecloud’ or ’azurestack’");
                    }
                    if (!enableOIDC) return [3 /*break*/, 8];
                    console.log('Using OIDC authentication...');
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 7, , 8]);
                    audience = core.getInput('audience', { required: false });
                    return [4 /*yield*/, core.getIDToken(audience)];
                case 4:
                    federatedToken = _b.sent();
                    if (!!!federatedToken) return [3 /*break*/, 6];
                    if (environment != "azurecloud" || "azureusgovernment")
                        throw new Error("Your current environment - \"".concat(environment, "\" is not supported for OIDC login."));
                    return [4 /*yield*/, jwtParser(federatedToken)];
                case 5:
                    _a = _b.sent(), issuer = _a[0], subjectClaim = _a[1];
                    console.log("Federated token details: \n issuer - " + issuer + " \n subject claim - " + subjectClaim);
                    _b.label = 6;
                case 6: return [3 /*break*/, 8];
                case 7:
                    error_1 = _b.sent();
                    core.error("".concat(error_1.message.split(':')[1], ". Please make sure to give write permissions to id-token in the workflow."));
                    return [3 /*break*/, 8];
                case 8:
                    if (!(environment == "azurestack")) return [3 /*break*/, 18];
                    if (!resourceManagerEndpointUrl) {
                        throw new Error("resourceManagerEndpointUrl is a required parameter when environment is defined.");
                    }
                    console.log("Unregistering cloud: \"".concat(environment, "\" first if it exists"));
                    _b.label = 9;
                case 9:
                    _b.trys.push([9, 12, , 13]);
                    return [4 /*yield*/, executeAzCliCommand("cloud set -n AzureCloud", true)];
                case 10:
                    _b.sent();
                    return [4 /*yield*/, executeAzCliCommand("cloud unregister -n \"".concat(environment, "\""), false)];
                case 11:
                    _b.sent();
                    return [3 /*break*/, 13];
                case 12:
                    error_2 = _b.sent();
                    console.log("Ignore cloud not registered error: \"".concat(error_2, "\""));
                    return [3 /*break*/, 13];
                case 13:
                    console.log("Registering cloud: \"".concat(environment, "\" with ARM endpoint: \"").concat(resourceManagerEndpointUrl, "\""));
                    _b.label = 14;
                case 14:
                    _b.trys.push([14, 16, , 17]);
                    baseUri = resourceManagerEndpointUrl;
                    if (baseUri.endsWith('/')) {
                        baseUri = baseUri.substring(0, baseUri.length - 1); // need to remove trailing / from resourceManagerEndpointUrl to correctly derive suffixes below
                    }
                    suffixKeyvault = ".vault" + baseUri.substring(baseUri.indexOf('.'));
                    suffixStorage = baseUri.substring(baseUri.indexOf('.') + 1);
                    profileVersion = "2019-03-01-hybrid";
                    return [4 /*yield*/, executeAzCliCommand("cloud register -n \"".concat(environment, "\" --endpoint-resource-manager \"").concat(resourceManagerEndpointUrl, "\" --suffix-keyvault-dns \"").concat(suffixKeyvault, "\" --suffix-storage-endpoint \"").concat(suffixStorage, "\" --profile \"").concat(profileVersion, "\""), false)];
                case 15:
                    _b.sent();
                    return [3 /*break*/, 17];
                case 16:
                    error_3 = _b.sent();
                    core.error("Error while trying to register cloud \"".concat(environment, "\": \"").concat(error_3, "\""));
                    return [3 /*break*/, 17];
                case 17:
                    console.log("Done registering cloud: \"".concat(environment, "\""));
                    _b.label = 18;
                case 18: return [4 /*yield*/, executeAzCliCommand("cloud set -n \"".concat(environment, "\""), false)];
                case 19:
                    _b.sent();
                    console.log("Done setting cloud: \"".concat(environment, "\""));
                    commonArgs = ["--service-principal",
                        "-u", servicePrincipalId,
                        "--tenant", tenantId
                    ];
                    if (allowNoSubscriptionsLogin) {
                        commonArgs = commonArgs.concat("--allow-no-subscriptions");
                    }
                    if (enableOIDC) {
                        commonArgs = commonArgs.concat("--federated-token", federatedToken);
                    }
                    else {
                        console.log("Note: Azure/login action also supports OIDC login mechanism. Refer https://github.com/azure/login#configure-a-service-principal-with-a-federated-credential-to-use-oidc-based-authentication for more details.");
                        commonArgs = commonArgs.concat("-p", servicePrincipalKey);
                    }
                    return [4 /*yield*/, executeAzCliCommand("login", true, loginOptions, commonArgs)];
                case 20:
                    _b.sent();
                    if (!!allowNoSubscriptionsLogin) return [3 /*break*/, 22];
                    args = [
                        "--subscription",
                        subscriptionId
                    ];
                    return [4 /*yield*/, executeAzCliCommand("account set", true, loginOptions, args)];
                case 21:
                    _b.sent();
                    _b.label = 22;
                case 22:
                    isAzCLISuccess = true;
                    if (!enableAzPSSession) return [3 /*break*/, 25];
                    // Attempting Az PS login
                    console.log("Running Azure PS Login");
                    spnlogin = new ServicePrincipalLogin_1.ServicePrincipalLogin(servicePrincipalId, servicePrincipalKey, federatedToken, tenantId, subscriptionId, allowNoSubscriptionsLogin, environment, resourceManagerEndpointUrl);
                    return [4 /*yield*/, spnlogin.initialize()];
                case 23:
                    _b.sent();
                    return [4 /*yield*/, spnlogin.login()];
                case 24:
                    _b.sent();
                    _b.label = 25;
                case 25:
                    console.log("Login successful.");
                    return [3 /*break*/, 28];
                case 26:
                    error_4 = _b.sent();
                    if (!isAzCLISuccess) {
                        core.setFailed("Az CLI Login failed. Please check the credentials and make sure az is installed on the runner. For more information refer https://aka.ms/create-secrets-for-GitHub-workflows");
                    }
                    else {
                        core.setFailed("Azure PowerShell Login failed. Please check the credentials and make sure az is installed on the runner. For more information refer https://aka.ms/create-secrets-for-GitHub-workflows\"");
                    }
                    return [3 /*break*/, 28];
                case 27:
                    // Reset AZURE_HTTP_USER_AGENT
                    core.exportVariable('AZURE_HTTP_USER_AGENT', prefix);
                    core.exportVariable('AZUREPS_HOST_ENVIRONMENT', azPSHostEnv);
                    return [7 /*endfinally*/];
                case 28: return [2 /*return*/];
            }
        });
    });
}
function executeAzCliCommand(command, silent, execOptions, args) {
    if (execOptions === void 0) { execOptions = {}; }
    if (args === void 0) { args = []; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    execOptions.silent = !!silent;
                    return [4 /*yield*/, exec.exec("\"".concat(azPath, "\" ").concat(command), args, execOptions)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function jwtParser(federatedToken) {
    return __awaiter(this, void 0, void 0, function () {
        var tokenPayload, bufferObj, decodedPayload;
        return __generator(this, function (_a) {
            tokenPayload = federatedToken.split('.')[1];
            bufferObj = Buffer.from(tokenPayload, "base64");
            decodedPayload = JSON.parse(bufferObj.toString("utf8"));
            return [2 /*return*/, [decodedPayload['iss'], decodedPayload['sub']]];
        });
    });
}
main();
