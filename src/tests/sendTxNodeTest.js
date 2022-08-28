/* eslint-disable require-jsdoc */
const { Sender } = require("../index");
const { Wallet } = require("../index");

const config = require("./test_config");

async function test() {
    const wallet = new Wallet(config.SERVER_ENDPOINT, config.WALLET);

    wallet.init();

    const sender = new Sender(wallet);

    const contracts = [
        {
            contract_name: "eosio.token", // example
            contract_action: "transfer", // example
            params: {
                from: wallet.executorAddress,
                memo: "",
                quantity: "0.01000000 WAX",
                to: "c2crc.wam", // if you want to donate :)
            },
        },
        {
            contract_name: "eosio.token", // example
            contract_action: "transfer", // example
            params: {
                from: wallet.executorAddress,
                memo: "",
                quantity: "0.01000000 WAX",
                to: "c2crc.wam",
            },
        },
    ];

    const [res, err] = await sender.sendTx(contracts);
    if (err) console.log(err);
}

test();
