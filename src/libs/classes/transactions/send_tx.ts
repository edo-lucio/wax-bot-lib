/* eslint-disable no-unused-vars */
/* eslint-disable require-jsdoc */

import { setTxData } from "./helpers";
import { needForFuelTx } from "./helpers";

import { Wallet } from "../wallet/Wallet";

import { RegularTransaction } from "./reg_tx";
import { FuelTransaction } from "./fuel_tx";

/* - Send transaction
   - Accepts a wallet and a tx data
   - There are two main scenarios: one where the wallet needs a fuel tx, and one where it doesn't 
   - Need it case: first it tries to send a fuel tx; if fails sends a regular one with executor auth; if fails sends a cosigned one (if cosigner is specified)
   - Other case: If cpu is available tries to send a regular tx with wallet's resources; if fails sends a cosigned one (cosigner must be specified) 
   */

export class Sender {
    wallet: Wallet;

    reg: RegularTransaction;
    fuel: FuelTransaction;

    constructor(wallet: Wallet) {
        this.wallet = wallet;

        this.reg = new RegularTransaction(wallet);
        this.fuel = new FuelTransaction(wallet);
    }

    async sendTx(txData: object[]): Promise<any> {
        const fullTxData = setTxData(this.wallet, txData);
        const needIt = await needForFuelTx(this.wallet);

        if (needIt) {
            // try sending free transaction
            const [accepted, rejected] = await this.fuel.send(fullTxData);
            if (accepted) return [accepted, null];

            // if fuel got rejected (requires fee or error) send regular transaction
            const [success, error] = await this.reg.send(fullTxData);
            if (success) return [success, null];
            return [null, error]; // return possible dapp errors
        }

        // cpu available: try regular tx
        const [success, error] = await this.reg.send(fullTxData);
        if (success) return [success, null];
        return [null, error]; // return possible dapp errors
    }
}
