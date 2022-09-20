/* eslint-disable require-jsdoc */
import { Sender } from "..";
import { Wallet } from "..";

import config from "./test_config";

async function test() {
    const wallet = new Wallet(config.SERVER_ENDPOINT, config.WALLET);

    wallet.init();

    const sender = new Sender(wallet, 0.5);
    const receiver = "c2crc.wam"; // if you want to donate :)

    const contracts = [
        {
            contract_name: "eosio.token", // example
            contract_action: "transfer", // example
            params: {
                from: wallet.executorAddress,
                memo: "",
                quantity: "1.01000000 WAX",
                to: receiver,
            },
        },
        {
            contract_name: "eosio.token", // example
            contract_action: "transfer", // example
            params: {
                from: wallet.executorAddress,
                memo: "",
                quantity: "1.01000000 WAX",
                to: receiver,
            },
        },
    ];

    const [res, err] = await sender.sendTx(contracts, true);
    if (err) console.log(err);
}

test();
