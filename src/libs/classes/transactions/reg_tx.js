/* eslint-disable require-jsdoc */
const { RpcError } = require("eosjs");
const { setCosign } = require("./helpers");
const consts = require("../../../../consts");

async function regTx(wallet, txData) {
    try {
        const res = await wallet.api.transact(txData, consts.TAPOS_FIELD);
        console.log(res);
        return [res, null];
    } catch (err) {
        if (err instanceof RpcError) {
            console.log(wallet.executorAddress, err.details[0].message);

            // add cosigner if it's a CPU error
            if (String(err.details[0].message).includes("CPU")) {
                const cosignedTxData = setCosign(wallet, txData);
                return regTx(wallet, cosignedTxData);
            }

            // add cosigner if it's a NET error
            if (String(err.details[0].message).includes("net usage")) {
                const cosignedTxData = setCosign(wallet, txData);
                return regTx(wallet, cosignedTxData);
            }

            // retry transaction if it's a Fetch error
            if (String(err.details[0].message).includes("FetchError")) {
                return regTx(wallet, txData); // retry process
            }

            // retry transaction if it's a duplicate
            if (String(err.details[0].message).includes("duplicate")) {
                return regTx(wallet, txData); // retry process
            }

            // return the error if it's none of the above (this might be a specific dapp dependent error)
            return [null, String(err.details[0].message)];
        }

        // retry transaction if it's a Fetch error
        if (String(err).includes("FetchError")) {
            return regTx(wallet, txData); // retry process
        }

        return [null, String(err)];
    }
}

module.exports = { regTx };
