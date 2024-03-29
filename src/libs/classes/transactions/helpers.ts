/* eslint-disable require-jsdoc */

import { Wallet } from "../wallet/Wallet";

/* set data of the transaction to be send*/
function setTxData(wallet: Wallet, contracts: any[]): Object {
    const authorization = [
        { actor: wallet.executorAddress, permission: "active" }, // set first signer
    ];

    const txData: any = { actions: [] };

    for (let i = 0; i < contracts.length; i++) {
        txData.actions.push({
            account: contracts[i].contract_name,
            name: contracts[i].contract_action,
            authorization: authorization,
            data: contracts[i].params,
        });
    }
    return txData;
}

/* check if wallet needs a fuel tx   */
async function needForFuelTx(wallet: Wallet): Promise<boolean> {
    try {
        const accountData = await wallet.rpc.get_account(
            wallet.executorAddress
        );

        const usedCPU = accountData.cpu_limit.used;
        const maxCPU = accountData.cpu_limit.max;

        if (maxCPU == 0) return true;

        const percentageUsed = (usedCPU / maxCPU) * 100;
        const res = percentageUsed >= 99 ? true : false;
        return res;
    } catch (error) {
        return needForFuelTx(wallet);
    }
}

function setCosign(wallet: Wallet, txData: any): object {
    for (let i = 0; i < txData.actions.length; i++) {
        if (txData.actions[i].authorization.length >= 2) continue; // do not add a cosigner if there's already one

        // add cosign if exists
        if (wallet.coSignAddress) {
            txData.actions[i].authorization.unshift({
                actor: wallet.coSignAddress,
                permission: "active",
            });
        }
    }
    return txData;
}

export { setTxData, needForFuelTx, setCosign };

// function setExecutor(actions, address) {
//     /* every wax tx needs an executor inside the data parameter */
//     actions.forEach((action) => {
//         const key = Object.keys(action)[1]; // "params" key
//         const actionParamsValue = action[key]; // "params" value
//         const executorParam = Object.keys(actionParamsValue)[0]; // "executor" key
//         actionParamsValue[executorParam] = address; // change ex key
//         action.params = actionParamsValue;
//     });

//     return actions;
// }
