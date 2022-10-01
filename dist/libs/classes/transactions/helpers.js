"use strict";
/* eslint-disable require-jsdoc */
Object.defineProperty(exports, "__esModule", { value: true });
exports.padTxData = exports.switchAuth = void 0;
function padTxData(actions) {
    return { actions: actions };
}
exports.padTxData = padTxData;
/* use executor resources if payer has insufficient */
function switchAuth(txData) {
    for (var i = 0; i < txData.actions.length; i++) {
        if (txData.actions[i].authorization.length < 2)
            continue;
        var payer = txData.actions[i].authorization[0];
        var executor = txData.actions[i].authorization[1];
        txData.actions[i].authorization[0] = executor;
        txData.actions[i].authorization[1] = payer;
    }
    return txData;
}
exports.switchAuth = switchAuth;
