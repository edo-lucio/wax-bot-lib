/* eslint-disable require-jsdoc */
const { Wallet } = require("./libs/classes/wallet/wallet");

const { sendTx } = require("./libs/classes/transactions/send_tx");

const { RpcWrapper } = require("./libs/classes/wallet/wrapper");

const { WaxBotHelpers } = require("./libs/methods/Helpers");

module.exports = { Wallet, sendTx, RpcWrapper, WaxBotHelpers };
