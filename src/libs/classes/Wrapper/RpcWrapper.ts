/* eslint-disable require-jsdoc */
import { Utils } from "../../utils/utils";
import { JsonRpc } from "eosjs";

class RpcWrapper {
    rpc: JsonRpc;

    constructor(rpc: JsonRpc) {
        this.rpc = rpc;
    }

    async fetchTable(
        contractName?: string,
        contractScope?: string,
        contractTable?: string,
        indexPosition?: string,
        lowerBound?: number,
        upperBound?: number,
        key?: string,
        reverse?: boolean
    ): Promise<any> {
        const tableOptions = {
            code: contractName,
            scope: contractScope,
            table: contractTable,
            index_position: indexPosition || 1,
            limit: 1000,
            lower_bound: lowerBound || null,
            upper_bound: upperBound || null,
            reverse: reverse || true,
            show_payer: false,
            json: true,
            key_type: key,
        };

        try {
            const res = await this.rpc.get_table_rows(tableOptions);
            return res;
        } catch (error) {
            console.log("\nCaught exception: " + error);
            await Utils.sleep(8000);
            return this.fetchTable(
                contractName,
                contractScope,
                contractTable,
                indexPosition,
                lowerBound,
                upperBound,
                key,
                reverse
            );
        }
    }

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
            await Utils.sleep(8000);
            return this.getAssetBalance(
                tokenDomain,
                walletAddress,
                tokenSymbol
            );
        }
    }

    async getAccount(walletAddress: string): Promise<any> {
        try {
            const accountData = await this.rpc.get_account(walletAddress);
            return accountData;
        } catch (error) {
            await Utils.sleep(4000);
            return this.getAccount(walletAddress);
        }
    }
}

export { RpcWrapper };
