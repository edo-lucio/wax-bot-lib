import { Wallet } from "../wallet/Wallet";

/* eslint-disable require-jsdoc */
import { RpcError } from "eosjs";
import { setCosign } from "./helpers";
import { consts } from "../../../consts";

export class RegularTransaction {
    wallet: Wallet;

    constructor(wallet: Wallet) {
        this.wallet = wallet;
    }

    async send(txData: any): Promise<any> {
        try {
            const res = await this.wallet.api.transact(
                txData,
                consts.TAPOS_FIELD
            );
            console.log(res);
            return [res, null];
        } catch (err: any) {
            if (err instanceof RpcError) {
                console.log(
                    this.wallet.executorAddress,
                    err.details[0].message
                );

                // retry transaction if it's a CPU error
                if (String(err.details[0].message).includes("CPU")) {
                    return this.send(txData);
                }

                // retry transaction if it's a NET error
                if (String(err.details[0].message).includes("net usage")) {
                    return this.send(txData);
                }

                // retry transaction if it's a Fetch error
                if (String(err.details[0].message).includes("FetchError")) {
                    return this.send(txData); // retry process
                }

                // retry transaction if it's a duplicate
                if (String(err.details[0].message).includes("duplicate")) {
                    return this.send(txData); // retry process
                }

                // return the error if it's none of the above (this might be a specific dapp dependent error)
                return [null, String(err.details[0].message)];
            }

            // retry transaction if it's a Fetch error
            if (String(err).includes("FetchError")) {
                return this.send(txData); // retry process
            }

            return [null, String(err)];
        }
    }
}
