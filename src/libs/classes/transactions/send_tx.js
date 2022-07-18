/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */

const { regTx } = require("./reg_tx");
const { fuelTx } = require("./fuel_tx");
const { setTxData } = require("./helpers");
const { needForFuelTx } = require("./helpers");

/* - Send transaction
   - Accepts a wallet and a tx data
   - There are two main scenarios: one where the wallet needs a fuel tx, and one where it doesn't 
   - Need it case: first it tries to send a fuel tx; if fails sends a regular one with executor auth; if fails sends a cosigned one (if cosigner is specified)
   - Other case: If cpu is available tries to send a regular tx with wallet's resources; if fails sends a cosigned one (cosigner must be specified) 
   */

async function sendTx(wallet, txData) {
    const fullTxData = setTxData(wallet, txData);
    const needIt = await needForFuelTx(wallet);

    if (needIt) {
        // try sending free transaction
        const [accepted, rejected] = await fuelTx(wallet, fullTxData);
        if (accepted) return [accepted, null];

        // if fuel got rejected (requires fee or error) send regular transaction
        const [success, error] = await regTx(wallet, fullTxData);
        if (success) return [success, null];
        return [null, error]; // return possible dapp errors
    }

    // cpu available: try regular tx
    const [success, error] = await regTx(wallet, fullTxData);
    if (success) return [success, null];
    return [null, error]; // return possible dapp errors
}

module.exports = { sendTx };
