import { Api, JsonRpc } from "eosjs";
import { RpcWrapper } from "../wrapper/RpcWrapper";
import { WalletCredentials } from "../../interfaces/interfaces";
declare class Wallet {
    executorAddress: string;
    executorPrivateKey: string;
    coSignAddress?: string;
    coSignPrivateKey?: string;
    serverEndpoint: string;
    api: Api;
    rpc: JsonRpc;
    rpcWrap: RpcWrapper;
    constructor(serverEndpoint: string, executorWallet: WalletCredentials, coSignWallet?: WalletCredentials);
    init(): void;
}
export { Wallet };
