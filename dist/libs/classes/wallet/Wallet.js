"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Wallet = void 0;
/* eslint-disable require-jsdoc */
var eosjs_1 = require("eosjs");
var eosjs_jssig_1 = require("eosjs/dist/eosjs-jssig"); // development only
var RpcWrapper_1 = require("../Wrapper/RpcWrapper");
var node_fetch_1 = __importDefault(require("node-fetch"));
var Wallet = /** @class */ (function () {
    function Wallet(serverEndpoint, executorWallet, coSignWallet) {
        // main
        this.executorAddress = executorWallet.address;
        this.executorPrivateKey = executorWallet.private_key;
        // cosign
        this.coSignAddress = coSignWallet === null || coSignWallet === void 0 ? void 0 : coSignWallet.address;
        this.coSignPrivateKey = coSignWallet === null || coSignWallet === void 0 ? void 0 : coSignWallet.private_key;
        // endpoint
        this.serverEndpoint = serverEndpoint;
    }
    Wallet.prototype.init = function () {
        var signers = [this.executorPrivateKey];
        // push cosign private key in signers array to provide
        typeof this.coSignPrivateKey != "undefined"
            ? signers.push(this.coSignPrivateKey)
            : null;
        var rpc = new eosjs_1.JsonRpc(this.serverEndpoint, { fetch: node_fetch_1.default });
        var signatureProvider = new eosjs_jssig_1.JsSignatureProvider(signers);
        this.api = new eosjs_1.Api({
            rpc: rpc,
            signatureProvider: signatureProvider,
        });
        this.rpc = rpc;
        this.rpcWrap = new RpcWrapper_1.RpcWrapper(rpc);
    };
    return Wallet;
}());
exports.Wallet = Wallet;
