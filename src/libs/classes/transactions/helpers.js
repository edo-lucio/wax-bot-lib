/* eslint-disable require-jsdoc */

/* set data of the transaction to be send*/
function setTxData(wallet, contract) {
    const authorization = [
        { actor: wallet.executorAddress, permission: "active" }, // set first signer
    ];

    const txData = {
        actions: [
            {
                account: contract.name,
                name: contract.action,
                authorization: authorization,
                data: contract.params,
            },
        ],
    };

    return txData;
}

/* check if wallet needs a fuel tx   */
async function needForFuelTx(wallet) {
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

function setCosign(wallet, txData) {
    if (txData.actions[0].authorization.length >= 2) return txData; // do not add a cosigner if there's already one

    // add cosign if exists
    if (wallet.coSignAddress) {
        txData.actions[0].authorization.unshift({
            actor: wallet.coSignAddress,
            permission: "active",
        });
    }

    return txData;
}

module.exports = { setTxData, needForFuelTx, setCosign };

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
