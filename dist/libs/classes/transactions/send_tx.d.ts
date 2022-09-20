import { Wallet } from "../wallet/Wallet";
import { RegularTransaction } from "./reg_tx";
import { FuelTransaction } from "./fuel_tx";
export declare class Sender {
    wallet: Wallet;
    reg: RegularTransaction;
    fuel: FuelTransaction;
    maxTxFee?: number;
    constructor(wallet: Wallet, maxTxFee?: number);
    sendTx(txData: object[], fuelTx?: boolean | false): Promise<any>;
}
