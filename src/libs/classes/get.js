/* eslint-disable require-jsdoc */
const { Utils } = require("../utils/utils");

class RpcWrapper {
    constructor(wallet) {
        this.wallet = wallet;
        this.rpc = wallet.rpc;
    }

    async fetchTable(account, scope, table, indexPosition, lb, ub, key) {
        const tableOptions = {
            code: account,
            scope: scope,
            table: table,
            index_position: indexPosition || 1,
            limit: 1000,
            lower_bound: lb || null,
            upper_bound: ub || null,
            reverse: false,
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
            return this.fetchTable(account, type, id, lb, ub);
        }
    }

    async getAssetBalance(tokenDomain, tokenSymbol) {
        try {
            const tokenBalance = await this.rpc.get_currency_balance(
                tokenDomain,
                this.wallet.executorAddress,
                tokenSymbol
            );

            if (tokenBalance.length) {
                return parseFloat(tokenBalance[0].replace(/[A-Za-z]+/g, ""));
            }
            return 0.0;
        } catch (error) {
            console.log("\nCaught exception: " + error);
            await Utils.sleep(8000);
            return this.getAssetBalance(tokenDomain, tokenSymbol);
        }
    }

    async getAccount(walletAddress) {
        try {
            const accountData = await this.rpc.get_account(walletAddress);
            return accountData;
        } catch (error) {
            await Utils.sleep(4000);
            return this.getAccount(walletAddress);
        }
    }
}

module.exports = { RpcWrapper };
