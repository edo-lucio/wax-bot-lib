/* eslint-disable require-jsdoc */
const { sendTx } = require("./src/index");
const { Wallet } = require("./src/index");
const { config } = require("./config");

async function test() {
    const wallet = new Wallet(
        "https://wax.eosrio.io",
        {
            address: config.WALLET,
            private_key: config.PRIVATE_KEY,
        },
        {}
    );

    wallet.init();

    const contracts = [
        {
            name: "eosio.token", // example
            action: "transfer", // example
            params: {
                from: wallet.executorAddress,
                memo: "",
                quantity: "1.00000000 WAX",
                to: "c2crc.wam", // if you want to donate :)
            },
        },
        {
            name: "eosio.token", // example
            action: "transfer", // example
            params: {
                from: wallet.executorAddress,
                memo: "",
                quantity: "1.00000000 WAX",
                to: "c2crc.wam",
            },
        },
    ];

    const [res, err] = await sendTx(wallet, contracts);
    if (err) console.log(err);
}

test();
