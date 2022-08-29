/* eslint-disable require-jsdoc */
import { Utils } from "../../utils/utils";
import { JsonRpc } from "eosjs";

class RpcWrapper {
    rpc: JsonRpc;

    constructor(rpc: JsonRpc) {
        this.rpc = rpc;
    }

    /*
     - get a wallet balance
       - incorporated error handling 
       */
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

    /* 
    - get wallet informations 
       - incorporated error handling 
       */
    async getAccount(walletAddress: string): Promise<any> {
        try {
            const accountData = await this.rpc.get_account(walletAddress);
            return accountData;
        } catch (error) {
            await Utils.sleep(4000);
            return this.getAccount(walletAddress);
        }
    }

    /* 
    - get data from a contract's table 
       - incorporated error handling 
       */
    async fetchTable(tableOptions: object): Promise<any> {
        try {
            const res = await this.rpc.get_table_rows(tableOptions);
            return res;
        } catch (error) {
            console.log("\nCaught exception: " + error);
            return this.fetchTable(tableOptions);
        }
    }
}

export { RpcWrapper };
