/* eslint-disable require-jsdoc */
const { Api, JsonRpc } = require("eosjs");
const { JsSignatureProvider } = require("eosjs/dist/eosjs-jssig"); // development only
const { TextEncoder, TextDecoder } = require("util");
const fetch = require("node-fetch");

class Wallet {
    constructor(serverEndpoint, executorWallet, coSignWallet) {
        // main
        this.executorAddress = executorWallet.address;
        this.executorPrivateKey = executorWallet.private_key;

        // cosign
        this.coSignAddress = coSignWallet.address;
        this.coSignPrivateKey = coSignWallet.private_key;

        // endpoint
        this.serverEndpoint = serverEndpoint;
    }

    init() {
        const signers = [this.executorPrivateKey];

        // push cosign private key in signers array to provide
        typeof this.coSignPrivateKey != "undefined"
            ? signers.push(this.coSignPrivateKey)
            : null;

        const rpc = new JsonRpc(this.serverEndpoint, { fetch });
        const signatureProvider = new JsSignatureProvider(signers);

        this.api = new Api({
            rpc,
            signatureProvider,
            textDecoder: new TextDecoder(),
            textEncoder: new TextEncoder(),
        });

        this.rpc = rpc;
    }
}

module.exports = { Wallet };
