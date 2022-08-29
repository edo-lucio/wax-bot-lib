import { Wallet } from "../wallet/Wallet";
export declare class FuelTransaction {
    wallet: Wallet;
    constructor(wallet: Wallet);
    send(txData: any): Promise<any>;
    signModifiedTransaction(modifiedTransaction: any): Promise<import("eosjs/dist/eosjs-rpc-interfaces").PushTransactionArgs>;
    validateTransaction(signer: any, modifiedTransaction: any, serializedTransaction: any, costs?: boolean): Promise<void>;
    validateActions(signer: any, modifiedTransaction: any, deserializedTransaction: any, costs: any): Promise<void>;
    determineExpectedActionsLength(costs: any): number;
    validateActionsContent(signer: any, expectedNewActions: any, modifiedTransaction: any, deserializedTransaction: any): Promise<void>;
    validateActionsFeeContent(signer: any, modifiedTransaction: any): Promise<void>;
    validateActionsRamContent(signer: any, modifiedTransaction: any): Promise<void>;
    validateActionsOriginalContent(expectedNewActions: any, modifiedTransaction: any, deserializedTransaction: any): void;
    validateActionsLength(expectedNewActions: any, modifiedTransaction: any, deserializedTransaction: any): void;
    validateNoop(modifiedTransaction: any): void;
}
