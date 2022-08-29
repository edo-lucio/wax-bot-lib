import { Wallet } from "../wallet/Wallet";
declare function setTxData(wallet: Wallet, contracts: any[]): Object;
declare function needForFuelTx(wallet: Wallet): Promise<boolean>;
declare function setCosign(wallet: Wallet, txData: any): object;
export { setTxData, needForFuelTx, setCosign };
