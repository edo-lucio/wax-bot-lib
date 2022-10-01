/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */

import { padTxData } from "./helpers";

import { Wallet } from "../wallet/wallet";

import { RegularTransaction } from "./reg_tx";
import { FuelTransaction } from "./fuel_tx";

import { consts } from "../../../consts";

/* - Send transaction
   - There are two main scenarios: one where the wallet needs a fuel tx, and one where it doesn't 
   - Need it case: first it tries to send a fuel tx; if fails sends a regular one with executor auth; if fails sends a cosigned one (if cosigner is specified)
   - Other case: If cpu is available tries to send a regular tx with wallet's resources; if fails sends a cosigned one (cosigner must be specified) 
   */

export class Sender {
    // sender wallet
    wallet: Wallet;

    // transactions
    reg: RegularTransaction;
    fuel: FuelTransaction;

    // max fuel tx fee
    maxTxFee?: number;

    constructor(wallet: Wallet, maxTxFee?: number) {
        this.wallet = wallet;
        this.maxTxFee = maxTxFee || 0;

        this.reg = new RegularTransaction(wallet);
        this.fuel = new FuelTransaction(wallet, this.maxTxFee);
    }

    /* fuelTx: if true try a fuel transaction first; send a regular one if false or undefined */
    async sendTx(
        txData: object[],
        TAPOS?: object,
        fuelTx?: boolean
    ): Promise<any> {
        TAPOS = TAPOS || consts.TAPOS_FIELD;
        fuelTx = fuelTx || false;

        let fullTxData = padTxData(txData);

        if (fuelTx) {
            // try sending free transaction
            const [accepted, rejected] = await this.fuel.send(fullTxData);
            if (accepted) return [accepted, null];

            // if fuel got rejected (requires fee or error) send regular transaction
            const [success, error] = await this.reg.send(fullTxData, TAPOS);
            if (success) return [success, null];

            // return possible dapp errors
            return [null, error];
        }

        // cpu available: try regular tx
        const [success, error] = await this.reg.send(fullTxData, TAPOS);
        if (success) return [success, null];

        // return possible dapp errors
        return [null, error];
    }
}
