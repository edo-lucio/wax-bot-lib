/* eslint-disable require-jsdoc */

function padTxData(actions: object[]): object {
    return { actions: actions };
}
/* use executor resources if payer has insufficient */
function switchAuth(txData: any): object {
    for (let i = 0; i < txData.actions.length; i++) {
        if (txData.actions[i].authorization.length < 2) continue;
        const payer = txData.actions[i].authorization[0];
        const executor = txData.actions[i].authorization[1];

        txData.actions[i].authorization[0] = executor;
        txData.actions[i].authorization[1] = payer;
    }

    return txData;
}

export { switchAuth, padTxData };
