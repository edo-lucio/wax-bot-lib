import { Wallet } from "../wallet/wallet";
import { RegularTransaction } from "./reg_tx";
import { FuelTransaction } from "./fuel_tx";
export declare class Sender {
    wallet: Wallet;
    reg: RegularTransaction;
    fuel: FuelTransaction;
    maxTxFee?: number;
    constructor(wallet: Wallet, maxTxFee?: number);
    sendTx(txData: object[], TAPOS?: object, fuelTx?: boolean): Promise<any>;
}
