/* eslint-disable require-jsdoc */
import { Api, JsonRpc } from "eosjs";
import { JsSignatureProvider } from "eosjs/dist/eosjs-jssig"; // development only

import { RpcWrapper } from "../wrapper/RpcWrapper";
import { WalletCredentials } from "../../interfaces/interfaces";

import fetch from "node-fetch";

class Wallet {
    executorAddress: string;
    executorPrivateKey: string;

    coSignAddress?: string;
    coSignPrivateKey?: string;

    serverEndpoint: string;

    api: Api;
    rpc: JsonRpc;

    rpcWrap: RpcWrapper;

    constructor(
        serverEndpoint: string,
        executorWallet: WalletCredentials,
        coSignWallet?: WalletCredentials
    ) {
        // main
        this.executorAddress = executorWallet.address;
        this.executorPrivateKey = executorWallet.private_key;

        // cosign
        this.coSignAddress = coSignWallet?.address;
        this.coSignPrivateKey = coSignWallet?.private_key;

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
        });

        this.rpc = rpc;
        this.rpcWrap = new RpcWrapper(this.serverEndpoint);
    }
}

export { Wallet };
