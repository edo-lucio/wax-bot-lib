import { Wallet } from "../wallet/Wallet";
import { RegularTransaction } from "./reg_tx";
import { FuelTransaction } from "./fuel_tx";
export declare class Sender {
    wallet: Wallet;
    reg: RegularTransaction;
    fuel: FuelTransaction;
    constructor(wallet: Wallet);
    sendTx(txData: object[]): Promise<any>;
}
