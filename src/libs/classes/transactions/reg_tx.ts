/* eslint-disable require-jsdoc */
import { Wallet } from "../wallet/wallet";
import { switchAuth } from "./helpers";
import { RpcError } from "eosjs";

export class RegularTransaction {
    wallet: Wallet;

    constructor(wallet: Wallet) {
        this.wallet = wallet;
    }

    async send(txData: any, tapos: object): Promise<any> {
        try {
            const res = await this.wallet.api.transact(txData, tapos);
            console.log(res);
            return [res, null];
        } catch (err: any) {
            if (err instanceof RpcError) {
                console.log(err);
                // retry transaction if it's a CPU error
                if (String(err.details[0].message).includes("CPU")) {
                    txData = switchAuth(txData);
                    return this.send(txData, tapos);
                }

                // retry transaction if it's a NET error
                if (String(err.details[0].message).includes("net usage")) {
                    txData = switchAuth(txData);
                    return this.send(txData, tapos);
                }

                // retry transaction if it's a Fetch error
                if (String(err.details[0].message).includes("FetchError")) {
                    return this.send(txData, tapos); // retry process
                }

                // retry transaction if it's a duplicate
                if (String(err.details[0].message).includes("duplicate")) {
                    return this.send(txData, tapos); // retry process
                }

                // return the error if it's none of the above (this might be a specific dapp dependent error)
                return [null, String(err.details[0].message)];
            }

            // retry transaction if it's a Fetch error
            if (String(err).includes("FetchError")) {
                return this.send(txData, tapos); // retry process
            }

            return [null, String(err)];
        }
    }
}
