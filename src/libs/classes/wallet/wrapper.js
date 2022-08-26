/* eslint-disable require-jsdoc */
const { Utils } = require("../../utils/utils");

class RpcWrapper {
    constructor(rpc) {
        this.rpc = rpc;
    }

    async fetchTable(
        contractName,
        contractScope,
        contractTable,
        indexPosition,
        lowerBound,
        upperBound,
        key,
        reverse
    ) {
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
            return this.fetchTable(account, type, id, lb, ub);
        }
    }

    async getAssetBalance(tokenDomain, walletAddress, tokenSymbol) {
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
