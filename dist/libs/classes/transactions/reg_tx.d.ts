import { Wallet } from "../wallet/wallet";
export declare class RegularTransaction {
    wallet: Wallet;
    constructor(wallet: Wallet);
    send(txData: any, tapos: object): Promise<any>;
}
