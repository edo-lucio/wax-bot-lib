/* eslint-disable require-jsdoc */
const { sendTx } = require("./src/index");
const { Wallet } = require("./src/index");

async function test() {
    const wallet = new Wallet(
        "https://wax.eosrio.io",
        {
            address: "",
            private_key: "",
        },
        {
            address: "",
            private_key: "",
        }
    );

    wallet.init();

    const txData = {
        name: "eosio.token", // example
        action: "transfer", // example
        params: {
            from: wallet.executorAddress,
            memo: "",
            quantity: "1.00000000 WAX",
            to: "badpollastro",
        },
    };

    await sendTx(wallet, txData);
}

test();
