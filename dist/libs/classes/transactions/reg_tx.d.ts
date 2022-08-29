import { Wallet } from "../wallet/Wallet";
export declare class RegularTransaction {
    wallet: Wallet;
    constructor(wallet: Wallet);
    send(txData: any): Promise<any>;
}
