/* eslint-disable require-jsdoc */
import { Api, JsonRpc } from "eosjs";
import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig"; // development only
import { RpcWrapper } from "../Wrapper/RpcWrapper";
import fetch from "node-fetch";
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
        var rpc = new JsonRpc(this.serverEndpoint, { fetch: fetch });
        var signatureProvider = new JsSignatureProvider(signers);
        this.api = new Api({
            rpc: rpc,
            signatureProvider: signatureProvider,
        });
        this.rpc = rpc;
        this.rpcWrap = new RpcWrapper(rpc);
    };
    return Wallet;
}());
export { Wallet };
