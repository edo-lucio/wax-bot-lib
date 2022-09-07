/* eslint-disable require-jsdoc */
import { Utils } from "../../utils/utils";
import { JsonRpc } from "eosjs";

import fetch from "node-fetch";

/* this wrapper has some rpc functions with error handling */
class RpcWrapper {
    rpc: JsonRpc;

    constructor(serverEndpoint: string) {
        this.rpc = new JsonRpc(serverEndpoint, { fetch });
    }

    /*- get a wallet balance */
    async getAssetBalance(
        tokenDomain: string,
        walletAddress: string,
        tokenSymbol: string
    ): Promise<any> {
        try {
            const tokenBalance = await this.rpc.get_currency_balance(
                tokenDomain,
                walletAddress,
                tokenSymbol
            );

            if (tokenBalance.length) {
                return parseFloat(tokenBalance[0].replace(/[A-Za-z]+/g, ""));
            }
            return 0.0;
        } catch (error) {
            console.log("\nCaught exception: " + error);
            return this.getAssetBalance(
                tokenDomain,
                walletAddress,
                tokenSymbol
            );
        }
    }

    /* - get wallet informations */
    async getAccount(walletAddress: string): Promise<any> {
        try {
            const accountData = await this.rpc.get_account(walletAddress);
            return accountData;
        } catch (error) {
            console.log("\nCaught exception: " + error);
            return this.getAccount(walletAddress);
        }
    }

    /* 
    - get data from a contract's table */
    async fetchTable(table_options: {
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
    }): Promise<unknown> {
        try {
            const res = await this.rpc.get_table_rows(table_options);
            return res;
        } catch (error) {
            console.log("\nCaught exception: " + error);
            return this.fetchTable(table_options);
        }
    }
}

export { RpcWrapper };
