import { JsonRpc } from "eosjs";
declare class RpcWrapper {
    rpc: JsonRpc;
    constructor(serverEndpoint: string);
    getAssetBalance(tokenDomain: string, walletAddress: string, tokenSymbol: string): Promise<any>;
    getAccount(walletAddress: string): Promise<any>;
    fetchTable(table_options: {
        code: string;
        scope: string;
        table: string;
        index_position?: any;
        limit?: number;
        lower_bound?: number;
        upper_bound?: number;
        reverse?: boolean;
        show_payer?: boolean;
        json?: boolean;
        key_type?: string;
    }): Promise<unknown>;
}
export { RpcWrapper };
